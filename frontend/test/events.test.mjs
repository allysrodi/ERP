import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createRequire } from 'node:module';
import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import { transformSync } from '@babel/core';
const require = createRequire(import.meta.url);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const native = Object.fromEntries(['Pressable','SafeAreaView','ScrollView','Text','TextInput','View'].map(name => [name,name]));
native.StyleSheet = { create: value => value }; native.useWindowDimensions = () => ({ width: 400 });
const styles = {};
function load(file, api, cache = new Map()) {
  file = resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} }; cache.set(file,module);
  const code = transformSync(readFileSync(file,'utf8'), { babelrc: false, configFile: false, plugins: [['@babel/plugin-transform-react-jsx',{ runtime:'automatic' }], '@babel/plugin-transform-modules-commonjs'] }).code;
  const localRequire = name => name === 'react-native' ? native : name.endsWith('/services/api') || name === '../services/api' ? { api, setAuthToken(){}, clearAuthToken(){}, setAuthExpiredHandler(){} } : name.startsWith('.') ? load(resolve(dirname(file),name+'.js'),api,cache) : require(name);
  new Function('require','module','exports',code)(localRequire,module,module.exports);
  return module.exports;
}
const recordsPath = new URL('../src/screens/RecordsScreen.js',import.meta.url).pathname;
const appPath = new URL('../App.js',import.meta.url).pathname;
const list = items => ({ data: { items, pagination: { pages:1 } } });
const text = root => JSON.stringify(root.toJSON());
const button = (root,label) => root.root.findAllByType('Pressable').find(node => node.findAllByType('Text').some(child => child.children.filter(value => typeof value === 'string').join('').includes(label)));
const input = (root,label) => root.root.findAllByType('TextInput').find(node => node.props.accessibilityLabel === label);

test('record events block duplicate save, confirm deactivation and reset on module switch', async () => {
  let saves=0, deletes=0, finishSave;
  const api={customers:async()=>list([{_id:'customer',name:'Ana',status:'ACTIVE'}]),suppliers:async()=>list([]),createCustomer:()=>{saves++;return new Promise(resolve=>{finishSave=resolve;});},deactivateCustomer:async()=>{deletes++;return {data:{}};}};
  const Screen=load(recordsPath,api).default;
  let root;
  await act(async()=>{root=Renderer.create(React.createElement(Screen,{key:'customers',moduleKey:'customers',companyId:'company',role:'ADMIN',styles}));});
  await act(async()=>{input(root,'Nombre').props.onChangeText('Nueva');});
  await act(async()=>{const press=button(root,'Crear registro').props.onPress;press();press();});
  assert.equal(saves,1);
  await act(async()=>{finishSave({data:{}});});
  await act(async()=>{button(root,'Desactivar').props.onPress();});
  assert.equal(deletes,0);
  await act(async()=>{button(root,'Confirmar desactivación').props.onPress();});
  assert.equal(deletes,1);
  await act(async()=>{button(root,'Editar').props.onPress();});
  assert.equal(input(root,'Nombre').props.value,'Ana');
  await act(async()=>{root.update(React.createElement(Screen,{key:'suppliers',moduleKey:'suppliers',companyId:'company',role:'ADMIN',styles}));});
  assert.equal(input(root,'Nombre').props.value,'');
  assert.ok(!text(root).includes('Guardar cambios'));
  await act(async()=>root.unmount());
});

test('late query from previous module cannot overwrite current list',async()=>{
  let resolveOld;
  const api={customers:()=>new Promise(resolve=>{resolveOld=resolve;}),suppliers:async()=>list([{_id:'supplier',name:'Proveedor nuevo'}])};
  const Screen=load(recordsPath,api).default;let root;
  await act(async()=>{root=Renderer.create(React.createElement(Screen,{key:'customers',moduleKey:'customers',companyId:'company',role:'EMPLEADO',styles}));});
  await act(async()=>{root.update(React.createElement(Screen,{key:'suppliers',moduleKey:'suppliers',companyId:'company',role:'EMPLEADO',styles}));});
  await act(async()=>{resolveOld(list([{_id:'old',name:'Cliente viejo'}]));});
  assert.ok(text(root).includes('Proveedor nuevo'));assert.ok(!text(root).includes('Cliente viejo'));assert.ok(!text(root).includes('Crear registro'));
  await act(async()=>root.unmount());
});

test('forgot-password link and return event navigate correctly',async()=>{
  const App=load(appPath,{forgotPassword:async()=>({data:{}})}).default;let root;
  await act(async()=>{root=Renderer.create(React.createElement(App));});
  await act(async()=>{button(root,'¿Olvidaste tu contraseña?').props.onPress();});
  assert.ok(text(root).includes('Recuperar contraseña'));
  await act(async()=>{button(root,'Volver a iniciar sesión').props.onPress();});
  assert.ok(text(root).includes('Iniciar sesion'));
  await act(async()=>root.unmount());
});

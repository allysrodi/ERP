import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
// Load the Expo service as ESM without changing Metro's package configuration.
const source = await readFile(new URL('../src/services/api.js', import.meta.url), 'utf8');
const { api, setAuthToken, clearAuthToken, setAuthExpiredHandler } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
test('logout removes authorization from subsequent requests', async () => {
  const original = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async (url, options) => { requests.push(options); return { ok: true, json: async () => ({ success: true, data: {} }) }; };
  try {
    setAuthToken('test-session');
    await api.health();
    clearAuthToken();
    await api.health();
    assert.equal(requests[0].headers.Authorization, 'Bearer test-session');
    assert.equal(requests[1].headers.Authorization, undefined);
  } finally { clearAuthToken(); globalThis.fetch = original; }
});
test('API retains status and validation details', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false, status: 400, json: async () => ({ success: false, message: 'Invalid', details: { fieldErrors: { name: ['Required'] } } }) });
  try { await assert.rejects(api.health(), error => error.status === 400 && error.details.fieldErrors.name[0] === 'Required'); }
  finally { globalThis.fetch = original; }
});
test('non JSON responses produce a readable error', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => ({ json: async () => { throw new SyntaxError(); } });
  try { await assert.rejects(api.health(), /respuesta inválida/); } finally { globalThis.fetch = original; }
});
test('expired session clears token and notifies login navigation', async () => {
  const original = globalThis.fetch;
  let expired = 0;
  globalThis.fetch = async () => ({ ok: false, status: 401, json: async () => ({success:false,message:'Token expirado'}) });
  setAuthToken('old-token'); setAuthExpiredHandler(() => expired++);
  try { await assert.rejects(api.health(), /Token expirado/); assert.equal(expired,1); }
  finally { clearAuthToken();setAuthExpiredHandler(null);globalThis.fetch=original; }
});

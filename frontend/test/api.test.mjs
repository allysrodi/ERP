import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
// Load the Expo service as ESM without changing Metro's package configuration.
const source = await readFile(new URL('../src/services/api.js', import.meta.url), 'utf8');
const { api, setAuthToken, clearAuthToken } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
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

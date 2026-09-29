const assert = require('node:assert/strict');
const createCycle = require('./reply-cycle.js');

for (const size of [1, 2, 3, 10, 18]) {
  const keys = Array.from({length: size}, (_, i) => `voice-${i}`);
  const cycle = createCycle(() => 0.37);
  const pool = 'w01|zh|hant';
  const shown = [cycle.current(pool, keys)];
  while (!cycle.exhausted(pool, keys)) shown.push(cycle.advance(pool, keys));
  assert.equal(shown.length, size);
  assert.equal(new Set(shown).size, size, `no repeats for ${size} choices`);
  assert.equal(cycle.advance(pool, keys), null, 'never repeats after the final choice');
  assert.equal(cycle.current(pool, keys), shown.at(-1), 'last choice stays visible');
  assert.equal(cycle.current('w01|en|', keys), keys[0], 'language has a separate pool');
  assert.equal(cycle.current('w01|zh|hans', keys), keys[0], 'script has a separate pool');
  assert.equal(cycle.current('w02|zh|hant', keys), keys[0], 'scenario has a separate pool');
}
console.log('Reply shuffle bags show each candidate once, then stop.');

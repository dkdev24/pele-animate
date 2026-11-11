// Regression: parseOrder/prepare stay linear on pathological input and keep behavior.
import assert from 'node:assert/strict';
import { parseOrder, prepare } from '../pele-animate.js';
const o = parseOrder('graph TD\n  %%  pa: 1=A,B 2=C 3=A>B\n');
assert.deepEqual([...o], [['A', 0], ['B', 0], ['C', 1], ['A>B', 2]]);
assert.match(prepare('x @{ icon: a, h: 3 } y'), /./);
const t = Date.now();
parseOrder('%%pa:' + ' '.repeat(50000) + '9'.repeat(50000));
prepare('@{{|'.repeat(20000));
assert.ok(Date.now() - t < 1500, 'regex too slow');
console.log('regex checks ok');

import test from 'ava';
import sinon from 'sinon';

import  { handleGetWorlds } from './handle-get-worlds.js';

test('sends en empty list if db contains no entry for worlds', t => {
  const send = sinon.spy();
  handleGetWorlds({ data: { worlds: null }}, null, { send });
  const sendCalls = send.getCalls();
  t.plan(2);
  t.is(sendCalls.length, 1);
  t.deepEqual(sendCalls[0].args[0], []);
});

test('sends the list of worlds', t => {
  const send = sinon.spy();
  handleGetWorlds({ data: { worlds: [1, 2, 3] }}, null, { send });
  const sendCalls = send.getCalls();
  t.plan(2);
  t.is(sendCalls.length, 1);
  t.deepEqual(sendCalls[0].args[0], [1, 2, 3]);
});

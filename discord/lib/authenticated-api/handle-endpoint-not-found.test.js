import test from 'ava';
import sinon from 'sinon';

import { handleEndpointNotFound } from './handle-endpoint-not-found';

test('sends 404', t => {
  const sendSpy = sinon.spy();
  const fakeRequest = {
    session: {},
    log: { debug: sinon.spy() },
  };
  const fakeResponse = { sendStatus: sendSpy };
  handleEndpointNotFound(fakeRequest, fakeResponse);
  const sendCalls = sendSpy.getCalls();
  t.plan(2);
  t.is(sendCalls.length, 1);
  t.is(sendCalls[0].args[0], 404);
});

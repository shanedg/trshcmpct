import test from 'ava';
import sinon from 'sinon';

import { handleApiError } from './handle-api-error';

test('sends 500', t => {
  const sendSpy = sinon.spy();
  const fakeRequest = {
    log: { error: sinon.spy() },
  };
  const fakeResponse = { sendStatus: sendSpy };
  handleApiError(fakeRequest, fakeResponse);
  const sendCalls = sendSpy.getCalls();
  t.plan(2);
  t.is(sendCalls.length, 1);
  t.is(sendCalls[0].args[0], 500);
});

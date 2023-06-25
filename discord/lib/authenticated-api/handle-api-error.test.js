import test from 'ava';
import sinon from 'sinon';

import { handleApiError } from './handle-api-error';

test('sends 500', t => {
  const sendSpy = sinon.spy();
  const nextSpy = sinon.spy();
  const fakeRequest = {
    log: { error: sinon.spy() },
  };
  const fakeResponse = { sendStatus: sendSpy };
  const caughtError = new Error('caught-api-error');

  handleApiError(caughtError, fakeRequest, fakeResponse, nextSpy);

  const sendCalls = sendSpy.getCalls();
  t.plan(2);
  t.is(sendCalls.length, 1);
  t.is(sendCalls[0].args[0], 500);
});

test('defers to default error handler if headers have been sent by the time an error is caught', t => {
  const fakeRequest = { log: { error: sinon.spy() }};
  const fakeResponse = { headersSent: true };
  const nextSpy = sinon.spy();
  const errorCaughtAfterHeadersSent = new Error('error-caught-after-headers-sent');

  handleApiError(errorCaughtAfterHeadersSent, fakeRequest, fakeResponse, nextSpy);

  const nextCalls = nextSpy.getCalls();
  t.plan(2);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('error-caught-after-headers-sent'));
});

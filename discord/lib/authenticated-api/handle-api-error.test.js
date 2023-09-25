import test from 'ava';
import sinon from 'sinon';

import { handleApiError } from './handle-api-error';

/**
 * Helper to create requests for testing
 * @returns A minimal request object
 */
const getRequest = () => ({
  log: {
    debug: sinon.spy(),
    error: sinon.spy(),
  },
});

test('sends 500', t => {
  const response = { sendStatus: sinon.spy() };

  handleApiError(new Error('caught-api-error'), getRequest(), response, sinon.spy());

  const sendCalls = response.sendStatus.getCalls();
  t.plan(2);
  t.is(sendCalls.length, 1);
  t.is(sendCalls[0].args[0], 500);
});

test('defers to default error handler if headers have been sent by the time an error is caught', t => {
  const nextSpy = sinon.spy();

  handleApiError(new Error('error-caught-after-headers-sent'), getRequest(), { headersSent: true }, nextSpy);

  const nextCalls = nextSpy.getCalls();
  t.plan(2);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('error-caught-after-headers-sent'));
});

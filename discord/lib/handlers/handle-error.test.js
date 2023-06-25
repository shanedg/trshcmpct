import test from 'ava';
import sinon from 'sinon';

import { handleError } from './handle-error';

const debugSpy = sinon.spy();
const errorSpy = sinon.spy();
const nextSpy = sinon.spy();
const sendSpy = sinon.spy();

const statusSpy = sinon.spy(() => ({
  // return send for chaining
  send: sendSpy
}));

const requestWithSpies = {
  log: {
    error: errorSpy,
    debug: debugSpy,
  },
};

const renderSpy = sinon.spy((template, locals, callback) => {
  callback(null, '<some-fake-html>');
});

const errorResponse = {
  render: renderSpy,
  send: sendSpy,
  status: statusSpy,
};

test.before(() => {
  handleError(new Error('caught-error'), requestWithSpies, errorResponse, nextSpy);
});

test('logs the original error', t => {
  const errorCalls = errorSpy.getCalls();
  t.plan(2);
  t.is(errorCalls.length, 1);
  t.deepEqual(errorCalls[0].args[0], new Error('caught-error'));
});

test('sets http status to 500', t => {
  const statusCalls = statusSpy.getCalls();
  t.plan(2);
  t.is(statusCalls.length, 1);
  t.is(statusCalls[0].args[0], 500);
});

test('renders the error template', t => {
  const renderCalls = renderSpy.getCalls();
  t.plan(4);
  t.is(renderCalls.length, 1);
  t.is(renderCalls[0].args[0], 'error');

  const sendCalls = sendSpy.getCalls();
  t.is(sendCalls.length, 1);
  t.is(sendCalls[0].args[0], '<some-fake-html>');
});

test('defers to default error handler for any error encountered rendering the template', t => {
  const caughtError = new Error('caught-error');
  const renderError = new Error('render-error');
  const badRenderSpy = sinon.spy((template, locals, callback) => {
    callback(renderError, null);
  });
  const badResponseWithSpies = {
    render: badRenderSpy,
    send: sinon.spy(),
    status: sinon.spy(() => ({
      // return send for chaining
      send: sinon.spy()
    })),
  };
  const requestWithErrorSpy = {
    log: {
      error: sinon.spy(),
      debug: sinon.spy(),
    },
  };
  const nextSpy = sinon.spy();

  handleError(caughtError, requestWithErrorSpy, badResponseWithSpies, nextSpy);

  const nextCalls = nextSpy.getCalls();
  t.plan(3);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('problem rendering error template'));
  t.deepEqual(nextCalls[0].args[0].cause, new Error('render-error'));
});

test('defers to default error handler if headers have already been sent by the time an error is caught', t => {
  const errorCaughtAfterHeadersSent = new Error('error-caught-after-headers-sent');
  const mockRequest = {
    log: {
      error: sinon.spy(),
      debug: sinon.spy(),
    },
  };
  const mockResponseWithHeadersSent = {
    headersSent: true,
    render: sinon.spy(),
    send: sinon.spy(),
    status: sinon.spy(),
  };
  const nextSpy = sinon.spy();

  handleError(errorCaughtAfterHeadersSent, mockRequest, mockResponseWithHeadersSent, nextSpy);

  const nextCalls = nextSpy.getCalls();
  t.plan(2);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('error-caught-after-headers-sent'));
});

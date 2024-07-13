import test from 'ava';
import sinon from 'sinon';

import { handleError } from './handle-error.js';

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

test.before(t => {
  const sendSpy = sinon.spy();
  t.context.response = {
    render: sinon.spy((_template, _locals, callback) => {
      callback(null, '<some-fake-html>');
    }),
    send: sendSpy,
    status: sinon.spy(() => ({
      // return with send for chaining
      send: sendSpy
    })),
  };
  t.context.request = getRequest();
  handleError(new Error('caught-error'), t.context.request, t.context.response, sinon.spy());
});

test('logs the original error', t => {
  const errorCalls = t.context.request.log.error.getCalls();
  t.plan(2);
  t.is(errorCalls.length, 1);
  t.deepEqual(errorCalls[0].args[0], new Error('caught-error'));
});

test('sets http status to 500', t => {
  const statusCalls = t.context.response.status.getCalls();
  t.plan(2);
  t.is(statusCalls.length, 1);
  t.is(statusCalls[0].args[0], 500);
});

test('renders the error template', t => {
  const renderCalls = t.context.response.render.getCalls();
  t.plan(4);
  t.is(renderCalls.length, 1);
  t.is(renderCalls[0].args[0], 'error');

  const sendCalls = t.context.response.send.getCalls();
  t.is(sendCalls.length, 1);
  t.is(sendCalls[0].args[0], '<some-fake-html>');
});

test('defers to default error handler for any error encountered rendering the template', t => {
  const sendSpy = sinon.spy();
  const response = {
    render: sinon.spy((_template, _locals, callback) => {
      callback(new Error('render-error'), null);
    }),
    send: sendSpy,
    status: sinon.spy(() => ({
      // return with send for chaining
      send: sendSpy
    })),
  };
  const nextSpy = sinon.spy();

  handleError(new Error('caught-error'), getRequest(), response, nextSpy);

  const nextCalls = nextSpy.getCalls();
  t.plan(3);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('problem rendering error template'));
  t.deepEqual(nextCalls[0].args[0].cause, new Error('render-error'));
});

test('defers to default error handler if headers have already been sent by the time an error is caught', t => {
  const responseWithHeadersSent = {
    headersSent: true,
    render: sinon.spy(),
    send: sinon.spy(),
    status: sinon.spy(),
  };
  const nextSpy = sinon.spy();

  handleError(new Error('error-caught-after-headers-sent'), getRequest(), responseWithHeadersSent, nextSpy);

  const nextCalls = nextSpy.getCalls();
  t.plan(2);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('error-caught-after-headers-sent'));
});

import test from 'ava';
import sinon from 'sinon';

import { handleError } from './handle-error';

const debugSpy = sinon.spy();
const errorSpy = sinon.spy();
const nextSpy = sinon.spy();
const sendSpy = sinon.spy();

const requestWithSpies = {
  log: { error: errorSpy, debug: debugSpy },
  query: { code: 'abc456' },
};

const renderSpy = sinon.spy((template, locals, callback) => {
  callback(null, '<some-fake-html>');
});
const errorResponse = { render: renderSpy, send: sendSpy };

test.before(() => {
  handleError(new Error('some-error'), requestWithSpies, errorResponse, nextSpy);
});

test('logs the original error', t => {
  t.plan(2);
  const errorCalls = errorSpy.getCalls();
  t.is(errorCalls.length, 1);
  t.deepEqual(errorCalls[0].args[0], new Error('some-error'));
});

test('renders the error template', t => {
  t.plan(4);
  const renderCalls = renderSpy.getCalls();
  t.is(renderCalls.length, 1);
  t.is(renderCalls[0].args[0], 'error');
  const sendCalls = sendSpy.getCalls();
  t.is(sendCalls.length, 1);
  t.is(sendCalls[0].args[0], '<some-fake-html>');
});

test('logs any error encountered rendering the template', t => {
  t.plan(2);
  const badRenderSpy = sinon.spy((template, locals, callback) => {
    callback(new Error('render-error'), '<some-fake-html />');
  });
  const localSendSpy = sinon.spy();
  const localDebugSpy = sinon.spy();
  const localErrorSpy = sinon.spy();
  const localNextSpy = sinon.spy();
  const badResponseWithSpies = {
    render: badRenderSpy,
    send: localSendSpy,
  };
  const localRequestWithSpies = {
    log: { error: localErrorSpy, debug: localDebugSpy },
    query: { code: 'abc456' },
  };
  handleError(new Error('some-error'), localRequestWithSpies, badResponseWithSpies, localNextSpy);
  const errorCalls = localErrorSpy.getCalls();
  t.is(errorCalls.length, 2);
  t.deepEqual(errorCalls[1].args[0], new Error('render-error'));
});

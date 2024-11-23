import test from 'ava';
import sinon from 'sinon';

import { handleLaunchExisting } from './handle-launch-existing.js';

/**
 * Create a mock response object
 * @returns A chainable mock response
 */
const getMockResponse = () => {
  return {
    // All mocked methods should return `this` to emulate chaining
    redirect: sinon.spy(function(_url) { return this; }),
    status: sinon.spy(function(_statusCode) { return this; }),
  };
};

test('calls next error handler if no id param', async t => {
  const next = sinon.spy();
  const response = getMockResponse();
  await handleLaunchExisting({ update: sinon.spy() }, { params: {} }, response, next);
  const nextCalls = next.getCalls();
  const statusCalls = response.status.getCalls();
  const redirectCalls = response.redirect.getCalls();
  t.plan(5);
  t.is(nextCalls.length, 1);
  t.is(nextCalls[0].args.length, 1);
  t.is(nextCalls[0].args[0], 'missing id param');
  t.is(statusCalls.length, 0);
  t.is(redirectCalls.length, 0);
});

test('calls next error handler if unable to query db', async t => {
  const next = sinon.spy();
  const response = getMockResponse();
  const update = _cb => { throw new Error('problem updating db!'); };
  await handleLaunchExisting({ update }, { params: { id: 'some-id' } }, response, next);
  const nextCalls = next.getCalls();
  const statusCalls = response.status.getCalls();
  const redirectCalls = response.redirect.getCalls();
  t.plan(5);
  t.is(nextCalls.length, 1);
  t.is(nextCalls[0].args.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('problem updating db!'));
  t.is(statusCalls.length, 0);
  t.is(redirectCalls.length, 0);
});

test('redirects to existing world if found', async t => {
  const response = getMockResponse();
  const worlds = [
    {
      id: 'some-id',
      status: 'stopped',
    },
  ];
  const update = sinon.spy(cb => new Promise(resolve => {
    cb({ worlds });
    resolve();
  }));
  await handleLaunchExisting({ update }, { params: { id: 'some-id' } }, response, sinon.spy());
  const statusCalls = response.status.getCalls();
  const redirectCalls = response.redirect.getCalls();
  t.plan(6);
  t.is(statusCalls.length, 1);
  t.is(statusCalls[0].args.length, 1);
  t.is(statusCalls[0].args[0], 202);
  t.is(redirectCalls.length, 1);
  t.is(redirectCalls[0].args.length, 1);
  t.is(redirectCalls[0].args[0], '/worlds/some-id');
});

test('redirects to worlds if existing id not found', async t => {
  const response = getMockResponse();
  const update = sinon.spy(cb => new Promise(resolve => {
    cb({ worlds: [] });
    resolve();
  }));
  await handleLaunchExisting({ update }, { params: { id: 'some-id' } }, response, sinon.spy());
  const statusCalls = response.status.getCalls();
  const redirectCalls = response.redirect.getCalls();
  t.plan(6);
  t.is(statusCalls.length, 1);
  t.is(statusCalls[0].args.length, 1);
  t.is(statusCalls[0].args[0], 404);
  t.is(redirectCalls.length, 1);
  t.is(redirectCalls[0].args.length, 1);
  t.is(redirectCalls[0].args[0], '/worlds');
});

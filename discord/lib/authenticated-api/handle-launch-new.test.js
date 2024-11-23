import test from 'ava';
import sinon from 'sinon';

import { handleLaunchNew } from './handle-launch-new.js';

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

test('redirects to a new world id', async t => {
  const response = getMockResponse();
  const db = { update: _cb => new Promise(resolve => resolve()) };
  await handleLaunchNew(db, { body: { name: 'some name' }}, response, sinon.spy());
  const redirectCalls = response.redirect.getCalls();
  const statusCalls = response.status.getCalls();
  t.plan(6);
  t.is(redirectCalls.length, 1);
  t.is(redirectCalls[0].args.length, 1);
  t.regex(redirectCalls[0].args[0], /\/worlds\/\w+/);
  t.is(statusCalls.length, 1);
  t.is(statusCalls[0].args.length, 1);
  t.is(statusCalls[0].args[0], 202);
});

test('inserts a new world in the database', async t => {
  const worlds = [];
  const update = sinon.spy(cb => new Promise(resolve => {
    cb({ worlds });
    resolve();
  }));
  await handleLaunchNew({ update }, { body: { name: 'some name' }}, getMockResponse(), sinon.spy());
  const updateCalls = update.getCalls();
  t.plan(2);
  t.is(updateCalls.length, 1);
  t.like(worlds, [{
    name: 'some name',
    status: 'pending',
  }]);
});

test('calls next error handler if unable to update db', async t => {
  const next = sinon.spy();
  const response = getMockResponse();
  const update = _cb => { throw new Error('problem updating db!'); };
  await handleLaunchNew({ update }, { body: { name: 'asdf' }}, response, next);
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

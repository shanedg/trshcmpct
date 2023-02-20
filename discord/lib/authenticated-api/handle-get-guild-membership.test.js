import test from 'ava';
import sinon from 'sinon';

import { handleGetGuildMembership } from './handle-get-guild-membership';

const authenticatedRequest = {
  session: {
    oauth: { access_token: 'some-access-token' }
  },
  log: {
    debug: sinon.spy(),
    error: sinon.spy(),
  }
};

const fakeGuildId = 'some-guild-id';

test('calls error middleware if missing authentication', async t => {
  const unauthenticatedRequest = {
    session: {},
    log: {
      debug: sinon.spy(),
      error: sinon.spy(),
    },
  };
  const nextSpy = sinon.spy();

  await handleGetGuildMembership(sinon.spy(), fakeGuildId, unauthenticatedRequest, {}, nextSpy);

  const nextCalls = nextSpy.getCalls();
  t.plan(2);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('missing authentication: {}'));
});

test('sends guild membership data if user is a guild member', async t => {
  const fetchMember = () => {
    return Promise.resolve({
      json: () => Promise.resolve({ user: 'data' })
    });
  };
  const sendSpy = sinon.spy();
  const fakeResponse = { send: sendSpy };

  await handleGetGuildMembership(fetchMember, fakeGuildId, authenticatedRequest, fakeResponse, sinon.spy());
  
  const sendCalls = sendSpy.getCalls();
  t.plan(2);
  t.is(sendCalls.length, 1);
  t.deepEqual(sendCalls[0].args[0], { user: 'data' });
});

test('sends a 403 if user is not a guild member', async t => {
  const fetchNotAMember = () => {
    return Promise.resolve({
      json: () => Promise.resolve({ message: 'Unknown Guild', code: 10004 })
    });
  };
  const sendStatusSpy = sinon.spy();
  const fakeResponse = { sendStatus: sendStatusSpy };

  await handleGetGuildMembership(fetchNotAMember, fakeGuildId, authenticatedRequest, fakeResponse, sinon.spy());

  const sendStatusCalls = sendStatusSpy.getCalls();
  t.plan(2);
  t.is(sendStatusCalls.length, 1);
  t.is(sendStatusCalls[0].args[0], 403);
});

test('calls error middleware with caught fetch errors', async t => {
  const fetchThrows = () => {
    throw new Error('some-error-in-fetch');
  };
  const nextSpy = sinon.spy();

  await handleGetGuildMembership(fetchThrows, fakeGuildId, authenticatedRequest, {}, nextSpy);

  const nextCalls = nextSpy.getCalls();
  t.plan(3);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('problem reaching discord api'));
  t.deepEqual(nextCalls[0].args[0].cause, new Error('some-error-in-fetch'));
});

test('calls error middleware with caught fetch rejections', async t => {
  const fetchRejects = () => Promise.reject('some-rejection-in-fetch');
  const nextSpy = sinon.spy();

  await handleGetGuildMembership(fetchRejects, fakeGuildId, authenticatedRequest, {}, nextSpy);

  const nextCalls = nextSpy.getCalls();
  t.plan(3);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('problem reaching discord api'));
  t.is(nextCalls[0].args[0].cause, 'some-rejection-in-fetch');
});

test('calls error middleware if unknown message found checking guild membership', async t => {
  const fetchUnknownMessage = () => {
    return Promise.resolve({
      json: () => Promise.resolve({ message: 'Some unknown problem' })
    });
  };
  const nextSpy = sinon.spy();

  await handleGetGuildMembership(fetchUnknownMessage, fakeGuildId, authenticatedRequest, {}, nextSpy);

  const nextCalls = nextSpy.getCalls();
  t.plan(3);
  t.is(nextCalls.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('unknown membership response'));
  t.deepEqual(nextCalls[0].args[0].cause, { message: 'Some unknown problem' });
});

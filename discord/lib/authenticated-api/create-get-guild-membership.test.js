import test from 'ava';
import sinon from 'sinon';

import { createGetGuildMembership } from './create-get-guild-membership';

const fakeLogger = {
  debug: sinon.spy(),
  error: sinon.spy(),
};

const authenticatedRequest = {
  session: {
    oauth: { access_token: 'some-access-token' }
  },
  log: fakeLogger
};

const unauthenticatedRequest = {
  session: {},
  log: fakeLogger,
};

const fetchMember = () => {
  return Promise.resolve({
    json: () => Promise.resolve({ user: 'data' })
  });
};

const fetchNotAMember = () => {
  return Promise.resolve({
    json: () => Promise.resolve({ message: 'Unknown Guild', code: 10004 })
  });
};

const fetchUnknownMessage = () => {
  return Promise.resolve({
    json: () => Promise.resolve({ messaage: 'Some unknown problem' })
  });
};

const fetchRejects = () => Promise.reject('some-error-in-fetch');
const fetchThrows = () => {
  throw new Error('some-error-in-fetch');
};

const fakeGuildId = 'some-guild-id';

test('creates a handler that calls next if missing authentication', async t => {
  const getMembership = createGetGuildMembership(sinon.spy(), fakeGuildId);
  const nextSpy = sinon.spy();
  await getMembership(unauthenticatedRequest, {}, nextSpy);
  const nextCalls = nextSpy.getCalls();
  t.plan(1);
  t.is(nextCalls.length, 1);
});

test('creates a handler that sends guild membership data if user is a guild member', async t => {
  const sendSpy = sinon.spy();
  const getMembership = createGetGuildMembership(fetchMember, fakeGuildId);
  const fakeResponse = { send: sendSpy };
  await getMembership(authenticatedRequest, fakeResponse, sinon.spy());
  const sendCalls = sendSpy.getCalls();
  t.plan(2);
  t.is(sendCalls.length, 1);
  t.deepEqual(sendCalls[0].args[0], { user: 'data' });
});

test('creates a handler that sends a 403 if user is not a guild member', async t => {
  const sendStatusSpy = sinon.spy();
  const getNoMembership = createGetGuildMembership(fetchNotAMember, fakeGuildId);
  const fakeResponse = { sendStatus: sendStatusSpy };
  await getNoMembership(authenticatedRequest, fakeResponse, sinon.spy());
  const sendStatusCalls = sendStatusSpy.getCalls();
  t.plan(2);
  t.is(sendStatusCalls.length, 1);
  t.is(sendStatusCalls[0].args[0], 403);
});

test('creates a handler that fails api requests gracefully', async t => {
  t.plan(2);

  const rejectsNextSpy = sinon.spy();
  const getMembershipRejects = createGetGuildMembership(fetchRejects, fakeGuildId);
  await getMembershipRejects(authenticatedRequest, {}, rejectsNextSpy);
  const nextCalls = rejectsNextSpy.getCalls();
  t.is(nextCalls.length, 1);

  const throwsNextSpy = sinon.spy();
  const getMembershipThrows = createGetGuildMembership(fetchThrows, fakeGuildId);
  await getMembershipThrows(authenticatedRequest, {}, throwsNextSpy);
  const nextCalls2 = throwsNextSpy.getCalls();
  t.is(nextCalls2.length, 1);
});

test('creates a handler that calls next if unknown message checking guild membership', async t => {
  const nextSpy = sinon.spy();
  const getMembership = createGetGuildMembership(fetchUnknownMessage, fakeGuildId);
  await getMembership(authenticatedRequest, {}, nextSpy);
  const nextCalls = nextSpy.getCalls();
  t.plan(1);
  t.is(nextCalls.length, 1);
});

import test from 'ava';
import sinon from 'sinon';

import { requireGuildMembership } from './require-guild-membership.js';

/**
 * Helper to create requests for testing
 * @param {Object | undefined} session Extra data to add to the request session
 * @returns A minimal mock request object
 */
const getRequest = (session = {}) => ({
  log: {
    debug: sinon.spy(),
    error: sinon.spy(),
  },
  session: {
    oauth: { /* needs to be truthy to be authenticated */ },
    ...session,
  },
});

test('allows an authorized session to continue', async t => {
  const nextSpy = sinon.spy();

  await requireGuildMembership(sinon.spy(), 'some-guild-id', getRequest({ authorized: true }), {}, nextSpy);

  const nextCalls = nextSpy.getCalls();
  t.plan(2);
  t.is(nextCalls.length, 1);
  t.is(nextCalls[0].args.length, 0);
});

test('sends status 403 for an unauthorized session', async t => {
  const response = { sendStatus: sinon.spy() };

  await requireGuildMembership(sinon.spy(), 'some-guild-id', getRequest({ authorized: false }), response, sinon.spy());

  const sendStatusCalls = response.sendStatus.getCalls();
  t.plan(3);
  t.is(sendStatusCalls.length, 1);
  t.is(sendStatusCalls[0].args.length, 1);
  t.is(sendStatusCalls[0].args[0], 403);
});

test('fetches authorized guild membership data for a new session', async t => {
  const request = getRequest();
  const nextSpy = sinon.spy();

  await requireGuildMembership(
    () => Promise.resolve({
      json: () => Promise.resolve({ user: 'data' })
    }),
    'some-guild-id',
    request,
    {},
    nextSpy
  );

  const nextCalls = nextSpy.getCalls();
  t.plan(4);
  t.is(nextCalls.length, 1);
  t.is(nextCalls[0].args.length, 0);
  t.is(request.session.authorized, true);
  t.deepEqual(request.session.guildMembershipData, { user: 'data' });
});

test('fetches unauthorized guild membership data for a new session', async t => {
  const request = getRequest();
  const response = { sendStatus: sinon.spy() };

  await requireGuildMembership(
    () => Promise.resolve({
      json: () => Promise.resolve({ message: 'Unknown Guild', code: 10004 })
    }),
    'some-guild-id',
    request,
    response,
    sinon.spy()
  );

  const sendStatusCalls = response.sendStatus.getCalls();
  t.plan(5);
  t.is(sendStatusCalls.length, 1);
  t.is(sendStatusCalls[0].args.length, 1);
  t.is(sendStatusCalls[0].args[0], 403);
  t.is(request.session.authorized, false);
  t.is(request.session.guildMembershipData, undefined);
});

test('calls next error handler if unable to fetch guild membership data for a new session', async t => {
  const nextSpy = sinon.spy();

  await requireGuildMembership(() => Promise.reject('some-fetch-error'), 'some-guild-id', getRequest(), {}, nextSpy);

  const nextCalls = nextSpy.getCalls();
  t.plan(4);
  t.is(nextCalls.length, 1);
  t.is(nextCalls[0].args.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('unable to check guild membership'));
  t.is(nextCalls[0].args[0].cause, 'some-fetch-error');
});

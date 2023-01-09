import test from 'ava';
import sinon from 'sinon';

import { requireAuthentication } from './require-authentication';

test('sends 401 if not authenticated', async t => {
  t.plan(2);
  const sendStatusSpy = sinon.spy();
  const nextSpy = sinon.spy();
  const fakeRequestWithEmptySession = { session: {} };
  const fakeResponse = { sendStatus: sendStatusSpy };
  await requireAuthentication(fakeRequestWithEmptySession, fakeResponse, nextSpy);
  const sendCalls = sendStatusSpy.getCalls();
  t.is(sendCalls.length, 1);
  t.is(sendCalls[0].args[0], 401);
});

test('calls next if authenticated', async t => {
  t.plan(1);
  const nextSpy = sinon.spy();
  const fakeRequestWithAuthenticatedSession = {
    session: {
      oauth: { access_token: 'some-access-token' }
    },
  };
  await requireAuthentication(fakeRequestWithAuthenticatedSession, {}, nextSpy);
  const nextCalls = nextSpy.getCalls();
  t.is(nextCalls.length, 1);
});

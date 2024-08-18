import test from 'ava';
import sinon from 'sinon';

import { handleLogout } from './handle-logout.js';

const fakeSessionData = {
  authorized: true,
  oauth: {},
  oauthExpires: '',
  guildMembershipData: {}
};

test('calls next middleware if no session', t => {
  const next = sinon.spy();
  handleLogout({}, {}, next);
  const nextCalls = next.getCalls();
  t.plan(2);
  t.is(nextCalls.length, 1);
  t.is(nextCalls[0].args.length, 0);
});

test('calls next middleware if not logged in', t => {
  const next = sinon.spy();
  handleLogout({
    session: {},
  }, {}, next);
  const nextCalls = next.getCalls();
  t.plan(2);
  t.is(nextCalls.length, 1);
  t.is(nextCalls[0].args.length, 0);
});

test('calls error handling middleware if unable to save cleared session', t => {
  const next = sinon.spy();
  handleLogout({
    session: {
      ...fakeSessionData,
      save: sinon.spy(callback => callback(new Error('unable-to-save'))),
    },
  }, {}, next);
  const nextCalls = next.getCalls();
  t.plan(3);
  t.is(nextCalls.length, 1);
  t.is(nextCalls[0].args.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('unable-to-save'));
});

test('calls error handling middleware if unable to regenerate new session', t => {
  const next = sinon.spy();
  handleLogout({
    session: {
      ...fakeSessionData,
      save: sinon.spy(callback => callback()),
      regenerate: sinon.spy(callback => callback(new Error('unable-to-regenerate'))),
    },
  }, {}, next);
  const nextCalls = next.getCalls();
  t.plan(3);
  t.is(nextCalls.length, 1);
  t.is(nextCalls[0].args.length, 1);
  t.deepEqual(nextCalls[0].args[0], new Error('unable-to-regenerate'));
});

test('clears data from session object', t => {
  const fakeSession = {
    ...fakeSessionData,
    save: sinon.spy(callback => callback()),
    regenerate: sinon.spy(callback => callback()),
  };
  t.plan(8);
  t.is(fakeSession.authorized, true);
  t.truthy(fakeSession.oauth);
  t.is(fakeSession.oauthExpires, '');
  t.truthy(fakeSession.guildMembershipData);
  handleLogout({ session: fakeSession }, {}, sinon.spy());
  t.is(fakeSession.authorized, null);
  t.is(fakeSession.oauth, null);
  t.is(fakeSession.oauthExpires, null);
  t.is(fakeSession.guildMembershipData, null);
});

test('calls next middleware after logging out', t => {
  const next = sinon.spy();
  handleLogout({
    session: {
      ...fakeSessionData,
      save: sinon.spy(callback => callback()),
      regenerate: sinon.spy(callback => callback()),
    },
  }, {}, next);
  const nextCalls = next.getCalls();
  t.plan(2);
  t.is(nextCalls.length, 1);
  t.is(nextCalls[0].args.length, 0);
});

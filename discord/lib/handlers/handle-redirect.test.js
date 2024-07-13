import test from 'ava';
import sinon from 'sinon';

import { handleRedirect } from './handle-redirect.js';

test('calls response.redirect with the url', t => {
  const redirectSpy = sinon.spy();

  handleRedirect('/destination', {}, { redirect: redirectSpy });

  const redirectCalls = redirectSpy.getCalls();
  t.plan(2);
  t.is(redirectCalls.length, 1);
  t.is(redirectCalls[0].args[0], '/destination');
});

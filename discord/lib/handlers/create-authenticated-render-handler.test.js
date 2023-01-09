import test from 'ava';
import sinon from 'sinon';

import { createAuthenticatedRenderHandler } from './create-authenticated-render-handler';

test('creates a handler that renders the authenticated view', async t => {
  const sendFileSpy = sinon.spy(() => Promise.resolve());
  const response = { sendFile: sendFileSpy };
  const reuseSessionToken = createAuthenticatedRenderHandler({
    htmlDirectory: '/absolute/path/to/html/directory',
    htmlFilename: 'index.html',
  });
  const sessionTokenRequest = {
    log: { error: sinon.spy(), debug: sinon.spy() },
    session: {
      oauth: {
        access_token: 'some-access-token',
        expires_in: 90,
      },
    },
  };
  await reuseSessionToken(sessionTokenRequest, response, sinon.spy());
  const sendFileCalls = sendFileSpy.getCalls();
  t.plan(3);
  t.is(sendFileCalls.length, 1);
  t.is(sendFileCalls[0].args[0], 'index.html');
  t.is(sendFileCalls[0].args[1].root, '/absolute/path/to/html/directory');
});

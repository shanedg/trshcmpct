import test from 'ava';

import { LoginRouter } from './login-router.js';

const testConfiguration = {
  clientId: 'some-client-id',
  clientSecret: 'some-client-secret',
  fetch: () => { /* noop */ },
  loginRedirect: '/',
  redirectUri: 'some-redirect-uri',
};

test('throws if missing client id', t => {
  t.throws(
    () => new LoginRouter({ ...testConfiguration, clientId: undefined }),
    { message: 'missing client id' }
  );
});

test('throws if missing client secret', t => {
  t.throws(
    () => new LoginRouter({ ...testConfiguration, clientSecret: undefined }),
    { message: 'missing client secret' }
  );
});

test('throws if missing fetch', t => {
  t.throws(
    () => new LoginRouter({ ...testConfiguration, fetch: undefined }),
    { message: 'missing fetch' }
  );
});

test('throws if missing login redirect', t => {
  t.throws(
    () => new LoginRouter({ ...testConfiguration, loginRedirect: undefined }),
    { message: 'missing login redirect' }
  );
});

test('throws if missing redirect uri', t => {
  t.throws(
    () => new LoginRouter({ ...testConfiguration, redirectUri: undefined }),
    { message: 'missing redirect uri' }
  );
});

test('throws if configuration is modified after construction', t => {
  const router = new LoginRouter(testConfiguration);

  t.throws(
    () => router.configuration.clientId = 'some-new-client-id',
    { message: /Cannot assign to read only property/ }
  );
});

test('throws if middleware is reinitialized', t => {
  const router = new LoginRouter(testConfiguration);

  t.throws(
    () => router.initializeMiddleware(),
    { message: 'login middleware already initialized' }
  );
});

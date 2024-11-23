import test from 'ava';

import { AuthenticatedAPIRouter } from './router.js';

const testConfiguration = {
  fetch: () => { /* noop */ },
  guildId: 'some-guild-id',
};

test('throws if missing fetch', t => {
  t.throws(
    () => new AuthenticatedAPIRouter({ ...testConfiguration, fetch: undefined }, {}),
    { message: 'missing fetch' }
  );
});

test('throws if missing guild id', t => {
  t.throws(
    () => new AuthenticatedAPIRouter({ ...testConfiguration, guildId: undefined }, {})
  );
});

test('throws if missing db', t => {
  t.throws(
    () => new AuthenticatedAPIRouter(testConfiguration, undefined),
  );
});

test('throws if configuration is modified after construction', t => {
  const router = new AuthenticatedAPIRouter(testConfiguration, {});

  t.throws(
    () => router.configuration.guildId = 'some-other-guild-id',
    { message: /Cannot assign to read only property/ }
  );
});

test('throws if middleware reinitialized', t => {
  const router = new AuthenticatedAPIRouter(testConfiguration, {});

  t.throws(
    () => router.initializeMiddleware(),
    { message: 'authenticated API middleware already initialized' }
  );
});

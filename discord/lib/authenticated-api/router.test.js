import test from 'ava';

import { AuthenticatedAPIRouter } from './router';

/**
 * For the purposes of these tests
 * we *really* only care if configuration options are truthy
 */
const testConfiguration = {
  fetch: () => { /* noop */ },
  guildId: 'some-guild-id',
};

test('throws if missing fetch', t => {
  t.throws(
    () => new AuthenticatedAPIRouter({ ...testConfiguration, fetch: undefined }),
    { message: 'missing fetch' }
  );
});

test('throws if missing guild id', t => {
  t.throws(
    () => new AuthenticatedAPIRouter({ ...testConfiguration, guildId: undefined })
  );
});

test('throws if configuration is modified after construction', t => {
  const router = new AuthenticatedAPIRouter(testConfiguration);

  t.throws(
    () => router.configuration.guildId = 'some-other-guild-id',
    { message: /Cannot assign to read only property/ }
  );
});

test('throws if middleware reinitialized', t => {
  const router = new AuthenticatedAPIRouter(testConfiguration);

  t.throws(
    () => router.initializeMiddleware(),
    { message: 'auhenticated api middleware already initialized' }
  );
});

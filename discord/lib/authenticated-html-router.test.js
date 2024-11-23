import test from 'ava';

import { AuthenticatedHTMLRouter } from './authenticated-html-router.js';

const testConfiguration = {
  htmlDirectory: '/some/absolute/path',
  htmlFilename: 'index.html',
  paths: ['/']
};

test('throws if missing html directory', t => {
  t.throws(
    () => new AuthenticatedHTMLRouter({ ...testConfiguration, htmlDirectory: undefined }),
    { message: 'missing html directory' }
  );
});

test('throws if missing html filename', t => {
  t.throws(
    () => new AuthenticatedHTMLRouter({ ...testConfiguration, htmlFilename: undefined }),
    { message: 'missing html filename' }
  );
});

test('throws if missing paths', t => {
  t.throws(
    () => new AuthenticatedHTMLRouter({ ...testConfiguration, paths: undefined }),
    { message: 'missing paths' }
  );
});

test('throws if configuration is modified after construction', t => {
  const router = new AuthenticatedHTMLRouter(testConfiguration);
  
  t.throws(
    () => router.configuration.htmlDirectory = '/some/other/path',
    { message: /Cannot assign to read only property/ }
  );
});

test('throws if middleware is reinitialized', t => {
  const router = new AuthenticatedHTMLRouter(testConfiguration);

  t.throws(
    () => router.initializeMiddleware(),
    { message: 'authenticated view middleware already initialized' }
  );
});

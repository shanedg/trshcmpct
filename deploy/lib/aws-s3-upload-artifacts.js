import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { putObject } from './aws-s3-sync.js';

try {
  const archiveData = readFileSync(
    new URL(join(dirname(import.meta.url), '..', '..', 'common/deploy/deploy.zip'))
  );
  await putObject('build-artifacts/deploy.zip', archiveData.toString('binary'));
} catch (e) {
  console.error(e);
  throw new Error('problem uploading build artifacts', { cause: e });
}

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { putObject } from './aws-s3-sync.js';

const environmentFromArgs = process.argv.length > 2 ? process.argv[2] : null;
if (!environmentFromArgs) {
  throw new Error(`Missing environment argument: ${environmentFromArgs}`);
}

/**
 * Get s3 bucket prefix for environment
 * (Bucket url is hardcoded but can be overridden via config)
 * @param {'staging'|'production'} environment
 */
const getBucketPrefix = environment => {
  if (environment === 'staging') {
    return 'www-stage';
  }

  if (environment === 'production') {
    return 'www';
  }

  throw new Error(`Unexpected environment: ${environment}`);
};

try {
  const archiveData = readFileSync(
    new URL(join(dirname(import.meta.url), '..', '..', 'common/deploy/deploy.zip'))
  );
  await putObject(`${getBucketPrefix(environmentFromArgs)}/deploy.zip`, archiveData);
} catch (e) {
  console.error(e);
  throw new Error('problem uploading build artifacts', { cause: e });
}

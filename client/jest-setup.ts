// Support extending Jest matchers from @testing-library/jest-dom:
// https://github.com/testing-library/jest-dom/blob/4723de3664d129dfa97a877a4e0a9d171bc4c720/README.md#usage
// Note this file needs to be .ts to include the necessary types:
// https://github.com/testing-library/jest-dom/blob/4723de3664d129dfa97a877a4e0a9d171bc4c720/README.md#with-typescript
import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder } from 'node:util';

// TextEncoder is not bundled with jsdom since v16
// https://stackoverflow.com/questions/68468203/why-am-i-getting-textencoder-is-not-defined-in-jest
// but needed for react-router-dom@7
Object.assign(global, { TextDecoder, TextEncoder });

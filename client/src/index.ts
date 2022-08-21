import { dirname, resolve } from 'node:path';

import App from './App/App';


// TODO: referencing this file (at least via this mechanism?) creates a [hash].css file in esm/ dir, want to avoid this
// const pathToStyleSheet = new URL('./style.css', import.meta.url);
const pathToStyleSheet = resolve(dirname(import.meta.url), 'style.css');

const containerId = 'root';

export {
  App,
  containerId,
  pathToStyleSheet,
};

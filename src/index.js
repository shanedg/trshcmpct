import { sayHello } from './lib';

if (window) {
  window.addEventListener('load', sayHello(window.document));
}

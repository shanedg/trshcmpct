import renderReact from './utils/renderReact';
import App from './App/App';

if (window) {
  window.addEventListener('load', () => renderReact(App));
}

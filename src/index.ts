import renderReact from './utils/renderReact';
import App from './App/App';

const main = () => {
  window.addEventListener('load', () => renderReact(App));
};

if (window) {
  main();
}

export default main;

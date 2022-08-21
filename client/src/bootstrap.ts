import { createElement } from 'react';
import { render } from 'react-dom';

import App from './App/App';

import './style.css';

render(
  createElement(App),
  document.getElementById('root')
);

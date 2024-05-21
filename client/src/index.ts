import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App/App';

import './reset.css';
import './style.css';

const containerId = 'root';
const container = document.getElementById(containerId);

if (!container) {
  throw new Error(`#${containerId} not found`);
}

const root = createRoot(container);
root.render(createElement(App));

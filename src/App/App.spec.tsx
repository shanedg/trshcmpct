import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import App from './App';

let container: Element | null = null;

describe('App', () => {

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container !== null) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  it('renders', () => {
    act(() => {
      render(<App />, container);
    });
    expect(container && container.textContent).toBe('trshcmpctr');
  });

});

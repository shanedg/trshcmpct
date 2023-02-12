import {
  render,
  screen,
} from '@testing-library/react';
import React from 'react';

import App from './App';
import { setClickjackStateForTestEnvironment } from './set-clickjack-state-for-test-environment';

describe('App', () => {
  beforeAll(() => setClickjackStateForTestEnvironment());

  it('renders a heading', () => {
    render(<App />);
    expect(screen.getByRole('heading')).toHaveTextContent('trshcmpctr');
  });
});

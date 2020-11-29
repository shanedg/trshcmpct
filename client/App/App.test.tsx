import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import {
  render,
  waitFor,
  screen,
} from '@testing-library/react';

import App from './App';

describe('App', () => {
  it('renders', async () => {
    render(<App />);

    await waitFor(() => screen.getByRole('heading'));

    expect(screen.getByRole('heading')).toHaveTextContent('trshcmpctr');
  });
});

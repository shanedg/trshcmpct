import {
  render,
  screen,
} from '@testing-library/react';
import React from 'react';

import App from './App';

describe('App', () => {
  it('renders', async () => {
    render(<App />);

    await screen.findByRole('heading');
    expect(screen.getByRole('heading')).toHaveTextContent('trshcmpctr');
  });
});

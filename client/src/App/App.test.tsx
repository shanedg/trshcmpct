import {
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import React from 'react';

import { App } from './App';

describe('App', () => {
  it('renders a heading', async () => {
    render(<App />);
    await waitFor(
      () => expect(screen.getByRole('heading')).toHaveTextContent('trshcmpctr')
    );
  });
});

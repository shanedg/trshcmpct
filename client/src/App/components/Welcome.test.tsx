import {
  render,
  screen,
} from '@testing-library/react';
import React from 'react';

import { Welcome } from './Welcome';

describe('Welcome', () => {
  it('renders a friendly message', () => {
    render(<Welcome />);
    expect(screen.getByText('welcome to the trash compactor')).toBeInTheDocument();
  });

  it('accepts an alternate friendly message', () => {
    render(
      <Welcome message="hello world" />
    );
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });
});

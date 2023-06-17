import {
  render,
  screen,
} from '@testing-library/react';
import React from 'react';

import { Shell } from './Shell';

describe('Shell', () => {
  it('renders children', () => {
    render((
      <Shell>
        <p>child</p>
      </Shell>
    ));
    expect(screen.getByText('child')).toBeTruthy();
  });
});

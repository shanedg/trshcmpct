import {
  render,
  screen,
} from '@testing-library/react';
import React from 'react';

import { Nav } from './Nav';

describe('Nav', () => {
  it('renders a list of links', () => {
    render(
      <Nav
        links={[
          {
            href: '#one',
            label: 'one'
          },
          {
            href: '#two',
          },
          {
            href: '#three',
            label: 'three'
          },
        ]}
      />
    );

    const oneEl = screen.getByText('one');
    expect(oneEl.getAttribute('href')).toBe('#one');

    const twoEl = screen.getByText('#two');
    expect(twoEl.getAttribute('href')).toBe('#two');

    const threeEl = screen.getByText('three');
    expect(threeEl.getAttribute('href')).toBe('#three');
  });

  it('uses href in place of a missing label', () => {
    const linkWithNoLabel = { href: '#two' };
    render(
      <Nav links={[linkWithNoLabel]} />
    );

    const twoEl = screen.getByText('#two');
    expect(twoEl).not.toBeUndefined();
    expect(twoEl.getAttribute('href')).toBe('#two');
  });
});

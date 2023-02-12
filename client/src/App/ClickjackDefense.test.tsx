import { render } from '@testing-library/react';
import React from 'react';

import { ClickjackDefense } from './ClickjackDefense';
import {
  cleanupClickjackStateForTestEnvironment,
  setClickjackStateForTestEnvironment,
} from './set-clickjack-state-for-test-environment';

describe('ClickjackDefense', () => {
  afterEach(() => {
    cleanupClickjackStateForTestEnvironment();
  });

  it('throws if local storage state is null', () => {
    setClickjackStateForTestEnvironment('some-state', null);
    expect(() => render(<ClickjackDefense />)).toThrow(new Error(`you may have been clickjacked!
  local storage state is null`));
  });

  it('throws if state does not match', () => {
    setClickjackStateForTestEnvironment('some-state', 'this-will-not-match');
    expect(() => render(<ClickjackDefense />)).toThrow(new Error(`you may have been clickjacked!
  server state: some-state
  local storage state: this-will-not-match`));
  });

  it('does not throw if state matches', () => {
    setClickjackStateForTestEnvironment('some-matching-state', 'some-matching-state');
    expect(() => render(<ClickjackDefense />)).not.toThrow();
  });
});

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

    /* eslint-disable @typescript-eslint/no-unsafe-call -- screen.getByRole "Unsafe call of an `any` typed value" */
    // @ts-expect-error: Property 'toHaveTextContent' does not exist on type 'Assertion'.ts(2339)
    // FIXME: 'toHaveTextContent' does exist but started throwing after adding Cypress to this project.
    expect(screen.getByRole('heading')).toHaveTextContent('trshcmpctr');
    /* eslint-enable @typescript-eslint/no-unsafe-call -- screen.getByRole "Unsafe call of an `any` typed value" */
  });
});

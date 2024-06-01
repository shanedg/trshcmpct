import { render, screen } from '@testing-library/react';
import React from 'react';

import { ErrorCard } from './ErrorCard';

describe('ErrorCard', () => {
  it('renders a generic error message if no error is provided', () => {
    render(<ErrorCard />);

    expect(screen.getByText('oops!')).toBeInTheDocument();
    expect(screen.queryByText('name:')).not.toBeInTheDocument();
    expect(screen.queryByText('message:')).not.toBeInTheDocument();
  });

  it('renders the name and message of a provided error', () => {
    render(<ErrorCard error={Error('some-error')}/>);

    expect(screen.getByText('oops!')).toBeInTheDocument();
    expect(screen.getByText('name:')).toBeInTheDocument();
    expect(screen.getByText('message:')).toBeInTheDocument();
    expect(screen.getByText('some-error')).toBeInTheDocument();
  });

  it('renders children as extra context', () => {
    render(
      <ErrorCard error={Error('some-error')}>
        <code>extra error context</code>
      </ErrorCard>
    );

    expect(screen.getByText('oops!')).toBeInTheDocument();
    expect(screen.getByText('name:')).toBeInTheDocument();
    expect(screen.getByText('message:')).toBeInTheDocument();
    expect(screen.getByText('some-error')).toBeInTheDocument();
    expect(screen.getByText('extra error context')).toBeInTheDocument();
  });
});

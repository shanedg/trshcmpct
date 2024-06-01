import { render, screen } from '@testing-library/react';
import React from 'react';

import { LoadingContent } from './LoadingContent';
import { useHasTimePassed } from '../hooks/use-has-time-passed';

jest.mock('../hooks/use-has-time-passed');

describe('LoadingContent', () => {
  beforeEach(() => {
    (useHasTimePassed as jest.Mock).mockReset();
  });

  it('renders nothing before time has passed', () => {
    (useHasTimePassed as jest.Mock).mockReturnValue(false);

    render(<LoadingContent />);

    expect(screen.queryByText('l o a d i n g . . .')).not.toBeInTheDocument();
  });

  it('renders loading message after time has passed', () => {
    (useHasTimePassed as jest.Mock).mockReturnValue(true);

    render(<LoadingContent />);

    expect(screen.getByText('l o a d i n g . . .')).toBeInTheDocument();
  });

  it('renders children in place of generic loading message', () => {
    (useHasTimePassed as jest.Mock).mockReturnValue(true);

    render(
      <LoadingContent>
        <p>c u s t o m _ m e s s a g e . . .</p>
      </LoadingContent>
    );

    expect(screen.getByText('c u s t o m _ m e s s a g e . . .')).toBeInTheDocument();
  });
});

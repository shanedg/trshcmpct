import React, { type PropsWithChildren } from 'react';

import { useHasTimePassed } from '../hooks/use-has-time-passed';

/**
 * Default loading message
 */
const GenericLoadingMessage = () => (
  <>
    <code>l o a d i n g . . .</code>
  </>
);

type LoadingContentProps = PropsWithChildren<{
  duration?: number;
}>

/**
 * A component that renders a loading message
 */
export const LoadingContent = ({ children, duration = 600 }: LoadingContentProps) => {
  // Wait a moment, content _might_ load quickly
  // Showing a loading message instantly can contribute to worse
  // perceived performance (Citation needed)
  const showLoading = useHasTimePassed(duration);
  
  if (showLoading) {
    return children ?
      children :
      <GenericLoadingMessage />;
  }

  return <></>;
};

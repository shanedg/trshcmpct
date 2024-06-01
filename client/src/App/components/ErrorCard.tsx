import React, { type PropsWithChildren } from 'react';

type ErrorCardProps = PropsWithChildren<{
  error?: Error;
}>

export const ErrorCard = ({ children, error }: ErrorCardProps) => {
  if (!error) {
    return <p>oops!</p>;
  }

  return (
    <article>
      <h2>oops!</h2>
      <p>name: <code>{error.name}</code></p>
      <p>message: <code>{error.message}</code></p>
      {children && <>{children}</>}
    </article>
  );
};

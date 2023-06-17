import React from 'react';

import type { FC, PropsWithChildren } from 'react';

export const Shell: FC<PropsWithChildren> = ({ children }) => {
  return (<>{children}</>);
};

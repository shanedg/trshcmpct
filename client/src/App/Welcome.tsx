import React, {
  FC,
} from 'react';

interface WelcomeProps {
  message?: string;
}

export const Welcome: FC<WelcomeProps> = ({
  message = 'welcome to the trash compactor'
}) => {
  return (
    <p>{message}</p>
  );
};

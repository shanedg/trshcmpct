import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook that returns a boolean state representing whether or not
 * some amount of time has passed since the host component was rendered
 * @param duration Time to wait in milliseconds
 * @returns Whether or not the time has passed
 */
export const useHasTimePassed = (duration = 500) => {
  const [hasTimePassed, setHasTimePassed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timeoutRef.current = setTimeout(() => setHasTimePassed(true), duration);

    return () => clearTimeout(timeoutRef.current);
  }, []);

  return hasTimePassed;
};

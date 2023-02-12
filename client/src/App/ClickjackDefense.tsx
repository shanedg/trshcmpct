import React, { FC, useEffect } from 'react';

/**
 * Server state rendered to html for comparison with state saved to local storage
 */
interface ClickjackDefenseServerState {
  state: string;
}

/**
 * Declare server->client window data namespace
 * i.e.
 * window.__trshcmpctr = { ... }
 */
declare global {
  interface Window { __trshcmpctr__: ClickjackDefenseServerState }
}

/**
 * Invisible component that throws an error if the server state doesn't match local storage
 * Helps ensure that authentication was initiated by our application
 */
export const ClickjackDefense: FC = () => {
  useEffect(() => {
    // render template state encoded to avoid unintended html character escaping
    const templateState: string = window.atob(decodeURIComponent(window.__trshcmpctr__.state));
    const localStorageState = localStorage.getItem('oauth-state');

    if (localStorageState === null) {
      throw new Error(`you may have been clickjacked!
  local storage state is null`);
    }

    if (templateState !== localStorageState) {
      throw new Error(`you may have been clickjacked!
  server state: ${templateState}
  local storage state: ${localStorageState}`);
    }
  }, []);
  return <></>;
};

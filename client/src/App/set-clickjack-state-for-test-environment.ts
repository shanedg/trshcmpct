/**
 * This module has side effects on the test environment:
 * - sets `window.__trshcmpctr__` property (normally set by server)
 * - stubs `window.localStorage` for jsdom
 */

/**
 * Mock implementation of browser local storage
 */
class LocalStorageMock {
  store: Record<string, string> = {};

  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  // stub
  get length() { return 1; }

  // stub
  key(_index: number): string | null { return 'some-key-name'; }
}

/**
 * Helper for exercising and bypassing clickjack defenses in the test environment
 */
export const setClickjackStateForTestEnvironment = (
  templateState = 'some-state',
  // local storage can return null if no item with key
  localStorageState: string | null = 'some-state'
) => {
  // template state is encoded to avoid unintended character escaping when rendered to html
  const uriEncodedBase64State = encodeURIComponent(window.btoa(templateState));

  const localStorageMock = new LocalStorageMock();
  // don't bother storing null for an item, just don't call setItem
  if (localStorageState !== null) {
    localStorageMock.setItem('oauth-state', localStorageState);
  }

  window.__trshcmpctr__ = { state: uriEncodedBase64State };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
  window.localStorage = localStorageMock;
};

/**
 * Helper that cleans up module changes to the test environment
 */
export const cleanupClickjackStateForTestEnvironment = () => {
  // @ts-expect-error: window.__trshcmpctr__ isn't optional
  delete window.__trshcmpctr__;
  // @ts-expect-error: window.localStorage isn't optional
  delete window.localStorage;
};

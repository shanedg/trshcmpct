/**
 * This entry is only built in development
 * Needs to run before the rest of the app
 * Ensures that we can bypass clickjack defenses while developing
 */
console.log('development');
Object.defineProperty(window, '__trshcmpctr__', {
  value: {
    state: encodeURIComponent(window.btoa('some-state'))
  }
});
window.localStorage.setItem('oauth-state', 'some-state');

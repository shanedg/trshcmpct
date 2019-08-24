/**
 * Add a Hellow World to the document
 * @param {*} document window document
 */
export function sayHello(document) {
  if (document) {
    const greeting = document.createElement('h1');
    greeting.textContent = 'Hello World';

    document.body.appendChild(greeting);
  }
}

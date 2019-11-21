import {
  Component,
  ComponentProps,
  createElement,
  FunctionComponent,
} from 'react';
import { render } from 'react-dom';

/**
 * Render React into a container in the DOM.
 */
const renderReact = (
  RootComponent: FunctionComponent<ComponentProps<typeof Component>>,
  containerId = 'root'
) => {
  render(
    createElement(RootComponent),
    document.getElementById(containerId),
    () => {
      if (__DEV__) {
        console.info(`React mounted at #${containerId}`);
      }
    }
  );
};

export default renderReact;

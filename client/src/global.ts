declare global {
  // Property 'toHaveTextContent' does not exist on type 'JestMatchers<HTMLElement>'.ts(2339)
  // https://github.com/testing-library/react-testing-library/issues/36#issuecomment-411434800
  namespace jest {
    interface Matchers<R> {
      toHaveTextContent: (htmlElement: string) => object;
    }
  }
}

export {};

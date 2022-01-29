import React, { StrictMode } from 'react';

const App = () => {
  if (__DEV__) {
    console.log('hi :)');
  }

  return (
    <StrictMode>
      <h1>trshcmpctr</h1>
    </StrictMode>
  );
};

export default App;

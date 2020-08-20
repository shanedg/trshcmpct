import React from 'react';
import { render } from 'enzyme';

import App from './App';

describe('App', () => {
  it('renders', () => {
    const wrapper = render(<App pathFragment="/test" />);
    expect(wrapper.text()).toMatch('trshcmpctr');
  });
});

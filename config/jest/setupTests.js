// Configure Enzyme for Jest:
// https://airbnb.io/enzyme/docs/installation/#working-with-react-16
// https://airbnb.io/enzyme/docs/guides/jest.html#using-enzyme-with-jest
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });

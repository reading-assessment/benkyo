import React from 'react';
import { shallow } from 'enzyme';
import App from './App.jsx';


// // from setupTests.js
import requestAnimationFrame from '../tempPolyfills';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter(), disableLifecycleMethods: true });


describe('App', () => {
  const app = shallow(<App />);
  it('renders properly', () => {
    expect(app).toMatchSnapshot();
  });
});

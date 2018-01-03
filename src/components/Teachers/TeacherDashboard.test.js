import React from 'react';
import { shallow } from 'enzyme';
import TeacherDashboard from './TeacherDashboard.jsx';


// // from setupTests.js
import requestAnimationFrame from '../../tempPolyfills';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter(), disableLifecycleMethods: true });


describe('TeacherDashboard', () => {
  const app = shallow(<TeacherDashboard />);
  it('renders properly', () => {
    expect(app).toMatchSnapshot();
  });
});

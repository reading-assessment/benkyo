import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App';
import renderer from 'react-test-renderer';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { stub } from 'sinon';

const mockStore = configureMockStore([thunk]);

describe('Component: App', () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      auth: {
        sport: 'BASKETBALL',
      },
    });
  });
  const items = ['Learn react', 'rest', 'go out'];

  it('should match its empty snapshot', () => {
    const tree = renderer.create(
      <App />
     ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
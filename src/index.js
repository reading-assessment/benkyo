import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import store from './store'

/****   Development Mode  ****/
window.s_mode = {
                  live: false,
                  base_url: 'http://127.0.0.1:3000',
                }

const app = document.getElementById('app')

ReactDOM.render(
    <Provider store={store}>
      <Router>
  	   <Route path="/" component={App} />
      </Router>
    </Provider>
, app);
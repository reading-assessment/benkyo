import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import store from './store'

  var config = {
    apiKey: "AIzaSyDrK20nhkadydh2tv4_PNFgqQuG64Ygers",
    authDomain: "benkyohr-e00dc.firebaseapp.com",
    databaseURL: "https://benkyohr-e00dc.firebaseio.com",
    projectId: "benkyohr-e00dc",
    storageBucket: "",
    messagingSenderId: "385974337950"
  };
firebase.initializeApp(config);

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
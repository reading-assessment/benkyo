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
    storageBucket: "gs://benkyohr-e00dc.appspot.com",
    messagingSenderId: "385974337950"
  };
firebase.initializeApp(config);

// /****   Development Mode  ****/
// window.s_mode = {
//                   live: false,
//                   base_url: 'http://127.0.0.1:3000',
//                   app_server: 'https://localhost:9005'
//                 }

/****   Production Mode  ****/
window.s_mode = {
                  live: false,
                  base_url: 'https://boiling-hollows-85549.herokuapp.com/',
                  app_server: 'https://sshenableddo.ioakeimidis.eu/benkyo-api-server'
                }

const app = document.getElementById('app')

ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>
, app);
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';

  var config = {
    apiKey: "AIzaSyBnMlXKxQmneHPgG-u5JP9wu1z45DDu75s",
    authDomain: "project-eden-bf70e.firebaseapp.com",
    databaseURL: "https://project-eden-bf70e.firebaseio.com",
    projectId: "project-eden-bf70e",
    storageBucket: "project-eden-bf70e.appspot.com",
    messagingSenderId: "656452826349"
  };
  firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

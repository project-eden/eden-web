import React, { Component } from 'react';
import MapContainer from '../MapContainer/MapContainer';
import './App.css';

class App extends Component {

  constructor() {
    super();
    // this.scriptCache = cache({
    //   google: 'https://api.google.com/some/script.js'
    // });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <div className="App-title">Eden</div>
        </div>
        <MapContainer />
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

import './MapContainer.css';

export class MapContainer extends Component {

  constructor() {
    super();
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: ''
    }
  }

  onMapClicked(props, map, e) {
    this.setState({
      activeMarker: e.latLng,
      selectedPlace: 'This is a place!',
      showingInfoWindow: false
    });
  }

  onMarkerClicked(props, marker, e) {
    this.setState({
      showingInfoWindow: true
    });
  }

  render() {
    return (
      <div>
        <Map google={ this.props.google } zoom={ 10 } onClick={ (props, map, e) => this.onMapClicked(props, map, e) }>

          <Marker position={ this.state.activeMarker } onClick={ (props, marker, e) => this.onMarkerClicked(props, marker, e) } />

          <InfoWindow position={ this.state.activeMarker } visible={ this.state.showingInfoWindow }>
            <div>
              <h1>{ this.state.selectedPlace }</h1>
            </div>
          </InfoWindow>

        </Map>
      </div>
    );
  }
}

MapContainer.propTypes = {};

export default GoogleApiWrapper({
  apiKey: ('AIzaSyAcrDZFaBO6jGznTGYK-O6jSxs7FQDlzy0')
})(MapContainer)

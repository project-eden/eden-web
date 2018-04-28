import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import PropTypes from 'prop-types';
import InfoCard from './InfoCard/InfoCard';
import './MapContainer.css';

export class MapContainer extends Component {

  constructor() {
    super();
    this.state = {
      activeMarker: {},
      currentCoordinates: {lat: 0, lng: 0},
      showingInfoWindow: false,
      crop: '',
      value: 0
    }
  }

  initMap(props, map) {
    map.setMapTypeId('satellite');
    map.setTilt(45);
    map.set('streetViewControl', false);
    map.set('minZoom', 2);
  }

  onMapClicked(props, map, e) {
    const currentCoordinates = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    fetch(`http://localhost:8080/top_crops?x=${currentCoordinates.lat}&y=${currentCoordinates.lng}&n=1`).then(response => {
      response.json().then(data => {
        const top = data.data;
        let crop, value;
        if (top.length === 0) {
          crop = 'noProduction';
          value = 0;
        } else {
          crop = top[0][0],
          value = top[0][1];
        }
        this.setState({
          currentCoordinates: currentCoordinates,
          showingInfoWindow: true,
          crop: crop,
          value: value
        });
      })
    });
  }

  render() {
    return (
      <div>
        <Map google={ this.props.google } zoom={ 10 }
            onReady={ (props, map) => this.initMap(props, map) }
            onClick={ (props, map, e) => this.onMapClicked(props, map, e) }>

          <InfoWindow
              position={ this.state.currentCoordinates }
              visible={ this.state.showingInfoWindow }>

            <InfoCard
                crop={ this.state.crop }
                value={ this.state.value }/>

          </InfoWindow>

        </Map>
      </div>
    );
  }
}

MapContainer.propTypes = {
  google: PropTypes.object, // Instance of Google API provided by the GoogleApiWrapper.
};

export default GoogleApiWrapper({
  apiKey: ('AIzaSyAcrDZFaBO6jGznTGYK-O6jSxs7FQDlzy0')
})(MapContainer)

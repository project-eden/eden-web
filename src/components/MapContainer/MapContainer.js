import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper, HeatMap} from 'google-maps-react';
import PropTypes from 'prop-types';
import config from 'constants/config.json';
import { getTopNCrops, whichCountry, allCoordinates } from 'utils/request';
import InfoCard from './InfoCard/InfoCard';
import SidePanel from './SidePanel/SidePanel';
import './MapContainer.css';

export class MapContainer extends Component {

  constructor() {
    super();
    this.state = {
      activeMarker: {},
      currentCoordinates: {lat: 0, lng: 0},
      showingInfoWindow: false,
      cropData: [],
      sidePanelOpen: false
    }
  }

  initMap(props, map) {
    map.setMapTypeId('satellite');
    map.setTilt(45);
    map.set('streetViewControl', false);
    map.set('minZoom', 2);
    map.set('maxZoom', 13);
    map.set('zoom', 3);
    map.setCenter({lat:20, lng:-20});
  }

  onMapClicked(props, map, e) {
    const currentCoordinates = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    getTopNCrops(currentCoordinates, 5).then(data => {
      this.setState({
        currentCoordinates: currentCoordinates,
        showingInfoWindow: true,
        cropData: data,
        sidePanelOpen: true
      });
    });
  }

  render() {
    return (
      <div>
        <Map
          google={ this.props.google }
          onReady={ (props, map) => this.initMap(props, map) }
          onClick={ (props, map, e) => this.onMapClicked(props, map, e) }>

          <Marker
            position={ this.state.currentCoordinates }
            onClick={ () => this.setState({sidePanelOpen: !this.state.sidePanelOpen}) }
          />

        </Map>

        <SidePanel
          onClose={ () => this.setState({sidePanelOpen: false}) }
          open={ this.state.sidePanelOpen }
          cropData={ this.state.cropData }
        />
      </div>
    );
  }
}

MapContainer.propTypes = {
  google: PropTypes.object, // Instance of Google API provided by the GoogleApiWrapper.
};

export default GoogleApiWrapper({
  apiKey: (config.API_KEY),
  libraries: ['places', 'visualization', 'geometry']
})(MapContainer)

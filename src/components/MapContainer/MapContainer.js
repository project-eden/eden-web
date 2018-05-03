import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper, HeatMap} from 'google-maps-react';
import PropTypes from 'prop-types';
import config from 'constants/config.json';
import { pixel_resolutions, heatmap_gradient } from 'constants/geoMappings.json';
import { getTopNCrops, getTopNPoints, whichCountry, allCoordinates, interestinCoordinates } from 'utils/request';
import InfoCard from './InfoCard/InfoCard';
import SidePanel from './SidePanel/SidePanel';
import './MapContainer.css';

export class MapContainer extends Component {

  constructor() {
    super();
    this.state = {
      activeMarker: {},
      currentCoordinates: {lat: 0, lng: 0},
      showingMarker: false,
      cropData: {},
      sidePanelOpen: false
    }
  }

  initMap(props, map) {
    map.setMapTypeId('satellite');
    map.setTilt(45);
    map.set('streetViewControl', false);
    map.set('minZoom', 3);
    map.set('maxZoom', 12);
    map.set('zoom', 3);
    map.setCenter({lat:20, lng:-20});

    interestinCoordinates(1000).then(data => {
      this.createHeatMap(data, map);
    });
  }

  getRadius(zoomLevel) {
    // 10km * the pixel resolution for the given zoom level.
    return 10000 / pixel_resolutions[String(zoomLevel)];
  }

  createHeatMap(data, map) {
    let heatmapdata = [];

    data.forEach(location => {
      heatmapdata.push(new this.props.google.maps.LatLng(location[1], location[0]));
    });

    var heatmap = new this.props.google.maps.visualization.HeatmapLayer({
      data: heatmapdata,
      gradient: heatmap_gradient,
      opacity: 0.7
    });

    heatmap.setMap(map);
    this.setState({
      heatmap
    });

    // Dynamically set the radius of the heat map points to preserve resolution.
    map.addListener('zoom_changed', () => {
      const zoomLevel = map.getZoom();
      if (zoomLevel >= 8) {
        this.state.heatmap.setOptions({
          radius: this.getRadius(zoomLevel)
        });
      }
    });
  }

  onMapClicked(props, map, e) {
    const currentCoordinates = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    getTopNCrops(currentCoordinates, 5).then(data => {
      this.setState({
        currentCoordinates: currentCoordinates,
        showingMarker: true,
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
            visible={ this.state.showingMarker }
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

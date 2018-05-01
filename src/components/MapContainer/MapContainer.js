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

    this.createHeatMap(map);
  }

  calcBounds(center,size){

    const n = this.props.google.maps.geometry.spherical.computeOffset(center,size.height /2,0).lat(),
      s = this.props.google.maps.geometry.spherical.computeOffset(center,size.height / 2,180).lat(),
      e = this.props.google.maps.geometry.spherical.computeOffset(center,size.width / 2,90).lng(),
      w=this.props.google.maps.geometry.spherical.computeOffset(center,size.width /2,270).lng();

      return  new this.props.google.maps.LatLngBounds(new this.props.google.maps.LatLng(s,w), new this.props.google.maps.LatLng(n,e));
}

  createHeatMap(map) {
    allCoordinates().then(data => {
      console.log('finished');
      let heatmapdata = [];

      data.sort( function() { return 0.5 - Math.random() } );

      var startingPoint = Math.floor(Math.random()*(data.length-0+1)+0);
      // data.slice(startingPoint, startingPoint + 2000).forEach(location => {
      //   // new this.props.google.maps.Rectangle({bounds:this.calcBounds(new this.props.google.maps.LatLng(location[1], location[0]), new this.props.google.maps.Size(10000,10000)),map:map});
      //   var cityCircle = new this.props.google.maps.Circle({
      //     strokeColor: '#FF0000',
      //     strokeOpacity: 0.35,
      //     strokeWeight: 2,
      //     fillColor: '#FF0000',
      //     fillOpacity: 0.35,
      //     map: map,
      //     center: new this.props.google.maps.LatLng(location[1], location[0]),
      //     radius: 2800,
      //     clickable: false
      //   });
      // });

      // var square = new this.props.google.maps.Polygon(berkeley, 50000, 10000, 50000, 10000, -60)

      var gradient = [
        'rgba(255, 0, 0, 0)',
        'rgba(255, 0, 0, 1)',
        'rgba(255, 0, 0, 1)',
        'rgba(255, 0, 0, 1)',
        'rgba(255, 0, 0, 1)',
        'rgba(255, 0, 0, 1)',
        'rgba(255, 0, 0, 1)',
        'rgba(255, 0, 0, 1)',
        'rgba(255, 0, 0, 1)',
        'rgba(255, 0, 0, 1)',
        'rgba(255, 0, 0, 1)',
        'rgba(255, 0, 0, 1)',
        'rgba(255, 0, 0, 1)',
        'rgba(255, 0, 0, 1)'
      ];

      data.slice(startingPoint, startingPoint+10000).forEach(location => {
        heatmapdata.push(new this.props.google.maps.LatLng(location[1], location[0]));
      });

      var heatmap = new this.props.google.maps.visualization.HeatmapLayer({
        data: heatmapdata,
        gradient: gradient,
      });

      heatmap.setMap(map);
      this.setState({
        heatmap
      });

      // map.addListener('zoom_changed', () => {
      //   let radius;
      //
      //   switch (map.getZoom()) {
      //     case 3:
      //       radius = 15
      //       break;
      //     case 4:
      //       radius = 15
      //       break;
      //     case 5:
      //       radius = 25
      //       break;
      //     case 6:
      //       radius = 45
      //       break;
      //     case 7:
      //       radius = 95
      //       break;
      //     case 8:
      //       radius = 180
      //       break;
      //     case 9:
      //       radius = 400
      //       break;
      //     default:
      //       radius = undefined;
      //   }
      //   if (radius) {
      //     this.state.heatmap.setOptions({
      //       radius: radius
      //     });
      //   }
      // });
    });
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
    console.log(map.getZoom());
    // console.log(this.state.heatmap.get('radius'));
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
            // onClick={ () => this.setState({sidePanelOpen: !this.state.sidePanelOpen}) }
            onClick={ () => this.state.heatmap.set({radius: 10}) }
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

import React, { Component } from 'react';

export default class Map extends Component {
  componentDidMount() {
    this.setMapWitCurrentLocation();
  }

  /** Initializes the TomTom map with current location */
  setMapWitCurrentLocation = () => {
    // get coordinates
    navigator.geolocation.getCurrentPosition(async (location) => {
      // set map with current coords
      const script = document.createElement('script');
      script.src = `${process.env.PUBLIC_URL}/sdk/tomtom.min.js`;
      document.body.appendChild(script);
      script.async = true;
      script.onload = function () {
        window.tomtom.L.map('map', {
          source: 'vector',
          key: '01ZXmKWLDr1TSBvi86xEvfIBv8DkMSX7',
          center: [location.coords.latitude, location.coords.longitude],
          basePath: '/sdk',
          zoom: 16,
        });
      };
    });
  }

  render() {
    return (
      <div className="map-container">
        <div id="map" />
      </div>
    );
  }
}

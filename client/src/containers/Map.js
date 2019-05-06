import React, { Component } from 'react';

export default class Map extends Component {
  componentDidMount() {
    const script = document.createElement('script');
    script.src = `${process.env.PUBLIC_URL}/sdk/tomtom.min.js`;
    document.body.appendChild(script);
    script.async = true;
    script.onload = function () {
      window.tomtom.L.map('map', {
        source: 'vector',
        key: '01ZXmKWLDr1TSBvi86xEvfIBv8DkMSX7',
        center: [37.769167, -122.478468],
        basePath: '/sdk',
        zoom: 15,
      });
    };
  }


  render() {
    return (
      <div className="map-container">
        <div id="map"></div>
      </div>
    )
  };
}

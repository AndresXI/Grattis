import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

let map;
const allServicesProvidedQuery = gql`
{
  getAllProvidedServices {
    title
    description
    username
    address
  }
}
`;
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
        map = window.tomtom.L.map('map', {
          source: 'vector',
          key: '01ZXmKWLDr1TSBvi86xEvfIBv8DkMSX7',
          center: [location.coords.latitude, location.coords.longitude],
          basePath: '/sdk',
          zoom: 14,
        });
      };
    });
  }


  render() {
    if (this.props.data.getAllProvidedServices) {
      this.props.data.getAllProvidedServices.forEach((service) => {
        // fetch coordinates for each address
        fetch(`https://api.tomtom.com/search/2/geocode/${service.address}.json?limit=1&countrySet=US&lat=37.337&lon=-121.89&topLeft=37.553%2C-122.453&btmRight=37.4%2C-122.55&key=01ZXmKWLDr1TSBvi86xEvfIBv8DkMSX7`)
          .then(res => {
            return res.json();
          })
          .then(data => {
            if (window.tomtom.L) {
              // set markers for each address
              window.tomtom.L.marker([data.results[0].position.lat, data.results[0].position.lon]).addTo(map);
            }
          })
      });
    }

    return (
      <div className="map-container">
        <div id="map" />
      </div>
    );

  }
}

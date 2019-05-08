import React, { Component } from 'react';
import gql from 'graphql-tag';

let map;
const newServiceProvidedSubscription = gql`
  subscription {
    newServiceProvided {
      title
      description
      address
      photoUrl
      username
    }
  }
`;

export default class Map extends Component {
  componentDidMount() {
    this.props.subscribeToMore({
      document: newServiceProvidedSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }
        console.log('data', prev);
        return {
          ...prev,
          getAllProvidedServices: [...prev.getAllProvidedServices, subscriptionData.data.newServiceProvided],
        };
      },
    });


    this.setMapWitCurrentLocation();
    this.renderInitialMarkers();
  }

  shouldComponentUpdate(prevProps) {
    prevProps.data.getAllProvidedServices.forEach((service) => {
      // console.log('PRE', service);
      // set coords to JSON object
      const coords = JSON.parse(service.address);
      if (window.tomtom) {
        window.tomtom.L.marker([coords.lat, coords.lon]).addTo(map);
      }
    });
    return true;
  }

  /** Render markers from database on componentDidMount */
  renderInitialMarkers = () => {
    if (this.props.data.getAllProvidedServices) {
      console.log('data', this.props);
      this.props.data.getAllProvidedServices.forEach((service) => {
        // set coords to JSON object
        const coords = JSON.parse(service.address);

        window.tomtom.L.marker([coords.lat, coords.lon]).addTo(map);
      });
    }
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

      script.onload = () => {
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
    return (
      <div className="map-container">
        <div id="map" />
      </div>
    );
  }
}

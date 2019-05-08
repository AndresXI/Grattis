import React, { Component } from 'react';
import gql from 'graphql-tag';

let map;
const newServiceProvidedSubscription = gql`
  subscription {
    newServiceProvided {
      title
      description
      address
      addressCoords
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
      const coords = JSON.parse(service.addressCoords);
      const popUpText = `
          <h3>${service.title}</h3>
          <p>${service.description}</p>
          <p>${service.address}</p>
        `;
      if (window.tomtom) {
        const marker = window.tomtom.L.marker([coords.lat, coords.lon]).addTo(map);
        marker.bindPopup(popUpText).openPopup();
      }
    });
    return true;
  }

  /** Render markers from database on componentDidMount */
  renderInitialMarkers = () => {
    if (this.props.data.getAllProvidedServices) {
      this.props.data.getAllProvidedServices.forEach((service) => {
        // set coords to JSON object
        const coords = JSON.parse(service.addressCoords);
        const popUpText = `
          <h3>${service.title}</h3>
          <p>by: ${service.username}</p>
          <p>${service.description}</p>
           <p>${service.address}</p>
        `;
        const marker = window.tomtom.L.marker([coords.lat, coords.lon], {
          icon: window.tomtom.L.icon({
            iconUrl: 'https://raw.githubusercontent.com/AndresXI/Grattis/master/client/public/sdk/images/marker-icon.png',
            iconSize: [50, 50],
            iconAnchor: [17, 70],
            popupAnchor: [12, -80]
          })
        }).addTo(map);
        marker.bindPopup(popUpText);
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
        this.renderInitialMarkers();
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

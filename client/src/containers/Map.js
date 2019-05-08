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
    if (prevProps.data) {
      prevProps.data.getAllProvidedServices.forEach((service) => {
        const coords = JSON.parse(service.addressCoords);
        const popUpText = `
               <h3>${service.title}</h3>
              <p>By: ${service.username}</p>
              <p>${service.description}</p>
              <p>${service.address}</p>
            `;
        if (window.tomtom) {
          const marker = window.tomtom.L.marker([coords.lat, coords.lon], {
            icon: window.tomtom.L.icon({
              iconUrl: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0%0D%0Ab3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZl%0D%0AcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8x%0D%0AIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8v%0D%0Ad3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUx%0D%0AMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3Bh%0D%0AY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8cGF0aCBkPSJNMjU2LDBDMTUzLjc1NSwwLDcw%0D%0ALjU3Myw4My4xODIsNzAuNTczLDE4NS40MjZjMCwxMjYuODg4LDE2NS45MzksMzEzLjE2NywxNzMu%0D%0AMDA0LDMyMS4wMzUNCgkJCWM2LjYzNiw3LjM5MSwxOC4yMjIsNy4zNzgsMjQuODQ2LDBjNy4wNjUt%0D%0ANy44NjgsMTczLjAwNC0xOTQuMTQ3LDE3My4wMDQtMzIxLjAzNUM0NDEuNDI1LDgzLjE4MiwzNTgu%0D%0AMjQ0LDAsMjU2LDB6IE0yNTYsMjc4LjcxOQ0KCQkJYy01MS40NDIsMC05My4yOTItNDEuODUxLTkz%0D%0ALjI5Mi05My4yOTNTMjA0LjU1OSw5Mi4xMzQsMjU2LDkyLjEzNHM5My4yOTEsNDEuODUxLDkzLjI5%0D%0AMSw5My4yOTNTMzA3LjQ0MSwyNzguNzE5LDI1NiwyNzguNzE5eiIvPg0KCTwvZz4NCjwvZz4NCjxn%0D%0APg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4N%0D%0ACjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8%0D%0AL2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K',
              iconSize: [30, 50],
              iconAnchor: [17, 70],
              popupAnchor: [12, -80]
            })
          }).addTo(map);
          marker.bindPopup(popUpText)
        }
      });
      return true;
    }
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
          <p>By: ${service.username}</p>
          <p>${service.description}</p>
           <p>${service.address}</p>
        `;
        const marker = window.tomtom.L.marker([coords.lat, coords.lon], {
          icon: window.tomtom.L.icon({
            iconUrl: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0%0D%0Ab3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZl%0D%0AcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8x%0D%0AIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8v%0D%0Ad3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUx%0D%0AMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3Bh%0D%0AY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8cGF0aCBkPSJNMjU2LDBDMTUzLjc1NSwwLDcw%0D%0ALjU3Myw4My4xODIsNzAuNTczLDE4NS40MjZjMCwxMjYuODg4LDE2NS45MzksMzEzLjE2NywxNzMu%0D%0AMDA0LDMyMS4wMzUNCgkJCWM2LjYzNiw3LjM5MSwxOC4yMjIsNy4zNzgsMjQuODQ2LDBjNy4wNjUt%0D%0ANy44NjgsMTczLjAwNC0xOTQuMTQ3LDE3My4wMDQtMzIxLjAzNUM0NDEuNDI1LDgzLjE4MiwzNTgu%0D%0AMjQ0LDAsMjU2LDB6IE0yNTYsMjc4LjcxOQ0KCQkJYy01MS40NDIsMC05My4yOTItNDEuODUxLTkz%0D%0ALjI5Mi05My4yOTNTMjA0LjU1OSw5Mi4xMzQsMjU2LDkyLjEzNHM5My4yOTEsNDEuODUxLDkzLjI5%0D%0AMSw5My4yOTNTMzA3LjQ0MSwyNzguNzE5LDI1NiwyNzguNzE5eiIvPg0KCTwvZz4NCjwvZz4NCjxn%0D%0APg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4N%0D%0ACjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8%0D%0AL2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K',
            iconSize: [30, 50],
            iconAnchor: [17, 70],
            popupAnchor: [12, -80],
          }),
        }).addTo(map);
        marker.bindPopup(popUpText).openPopup();
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

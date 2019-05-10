import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';


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

const newServiceNeededSubscription = gql`
  subscription {
    newServiceNeeded {
      title
      description
      address
      addressCoords
      username
    }
  }
`;

export default class Map extends Component {
  componentDidMount() {
    this.props.subscribeToMoreProvided({
      document: newServiceProvidedSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }
        return {
          ...prev,
          getAllProvidedServices: [...prev.getAllProvidedServices, subscriptionData.data.newServiceProvided],
        };
      },
    });

    this.props.subscribeToMoreNeeded({
      document: newServiceNeededSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }
        return {
          ...prev,
          getAllNeededServices: [...prev.getAllNeededServices, subscriptionData.data.newServiceNeeded],
        };
      },
    })


    this.setMapWitCurrentLocation();
    this.renderInitialMarkers();
  }

  shouldComponentUpdate(prevProps) {

    // Update Provided Services
    if (prevProps.data && this.props.data.getAllProvidedServices) {
      if (this.props.data.getAllProvidedServices.length !== prevProps.data.getAllProvidedServices.length) {
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
                iconUrl: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMnB0IiB2aWV3Qm94PSItNzYgMCA1MTIgNTEyIiB3aWR0aD0iNTEycHQi%0D%0AIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTMzNSA0MzdjMC00%0D%0AMS40MjE4NzUtNjkuMzk0NTMxLTc1LTE1NS03NXMtMTU1IDMzLjU3ODEyNS0xNTUgNzUgNjkuMzk0%0D%0ANTMxIDc1IDE1NSA3NSAxNTUtMzMuNTc4MTI1IDE1NS03NXptMCAwIiBmaWxsPSIjOTNkNDM3Ii8+%0D%0APHBhdGggZD0ibTE4MCAzNjJ2MTUwYzg1LjYwNTQ2OSAwIDE1NS0zMy41NzgxMjUgMTU1LTc1cy02%0D%0AOS4zOTQ1MzEtNzUtMTU1LTc1em0wIDAiIGZpbGw9IiM3NWJmMDAiLz48cGF0aCBkPSJtMTc5Ljk5%0D%0ANjA5NCA0NTEuNzIyNjU2Yy00LjQzMzU5NCAwLTguNjQwNjI1LTEuOTY0ODQ0LTExLjQ5MjE4OC01%0D%0ALjM1OTM3NWwtMTI2LjM5ODQzNy0xNTAuNjYwMTU2Yy0uMTMyODEzLS4xNjAxNTYtLjI2NTYyNS0u%0D%0AMzIwMzEzLS4zOTA2MjUtLjQ4ODI4MS0yNi45MDIzNDQtMzIuMjYxNzE5LTQxLjcxNDg0NC03My4x%0D%0ANTIzNDQtNDEuNzE0ODQ0LTExNS4yMTQ4NDQgMC05OS4yNTM5MDYgODAuNzQ2MDk0LTE4MCAxODAt%0D%0AMTgwczE4MCA4MC43NDYwOTQgMTgwIDE4MGMwIDQyLjEyNS0xNC44NTE1NjIgODMuMDcwMzEyLTQx%0D%0ALjgzMjAzMSAxMTUuMzU1NDY5LS4wOTM3NS4xMTcxODctLjE4NzUuMjM0Mzc1LS4yODUxNTcuMzQ3%0D%0ANjU2bC0xMjYuMzk0NTMxIDE1MC42NTYyNWMtMi44NTE1NjIgMy4zOTg0MzctNy4wNTg1OTMgNS4z%0D%0ANjMyODEtMTEuNDkyMTg3IDUuMzYzMjgxem0wIDAiIGZpbGw9IiMwMDkzZmYiLz48cGF0aCBkPSJt%0D%0AMTgwIDB2NDUxLjcxODc1YzQuNDMzNTk0IDAgOC42NDA2MjUtMS45NjA5MzggMTEuNDg4MjgxLTUu%0D%0AMzU5Mzc1bDEyNi4zOTQ1MzEtMTUwLjY1NjI1Yy4wOTc2NTctLjExMzI4MS4xOTE0MDctLjIyNjU2%0D%0AMy4yODUxNTctLjM0NzY1NiAyNi45ODA0NjktMzIuMjg1MTU3IDQxLjgzMjAzMS03My4yMzA0Njkg%0D%0ANDEuODMyMDMxLTExNS4zNTU0NjkgMC05OS4yNTM5MDYtODAuNzQ2MDk0LTE4MC0xODAtMTgwem0w%0D%0AIDAiIGZpbGw9IiMwMDdkZWYiLz48cGF0aCBkPSJtMTgwIDI3MWMtOC4yODUxNTYgMC0xNS02Ljcx%0D%0ANDg0NC0xNS0xNXYtMTYwYzAtOC4yODUxNTYgNi43MTQ4NDQtMTUgMTUtMTVzMTUgNi43MTQ4NDQg%0D%0AMTUgMTV2MTYwYzAgOC4yODUxNTYtNi43MTQ4NDQgMTUtMTUgMTV6bTAgMCIgZmlsbD0iI2Q3ZjBm%0D%0ANSIvPjxwYXRoIGQ9Im0xOTUgMzAxYzAgOC4yODUxNTYtNi43MTQ4NDQgMTUtMTUgMTVzLTE1LTYu%0D%0ANzE0ODQ0LTE1LTE1IDYuNzE0ODQ0LTE1IDE1LTE1IDE1IDYuNzE0ODQ0IDE1IDE1em0wIDAiIGZp%0D%0AbGw9IiNkN2YwZjUiLz48ZyBmaWxsPSIjYzNlMWViIj48cGF0aCBkPSJtMTk1IDI1NnYtMTYwYzAt%0D%0AOC4yODUxNTYtNi43MTQ4NDQtMTUtMTUtMTV2MTkwYzguMjg1MTU2IDAgMTUtNi43MTQ4NDQgMTUt%0D%0AMTV6bTAgMCIvPjxwYXRoIGQ9Im0xOTUgMzAxYzAtOC4yODUxNTYtNi43MTQ4NDQtMTUtMTUtMTV2%0D%0AMzBjOC4yODUxNTYgMCAxNS02LjcxNDg0NCAxNS0xNXptMCAwIi8+PC9nPjwvc3ZnPg==',
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
    }
    // Update Needed Services
    if (prevProps.neededServices.getAllNeededServices && this.props.neededServices.getAllNeededServices) {
      console.log('prev', prevProps.neededServices.getAllNeededServices.length);
      console.log('current', this.props.neededServices.getAllNeededServices);
      // console.log('data', prevProps.neededServices.getAllNeededServices)
      if (this.props.neededServices.getAllNeededServices.length !== prevProps.neededServices.getAllNeededServices.length) {
        prevProps.neededServices.getAllNeededServices.forEach((service) => {
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
                iconUrl: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMXB0IiB2aWV3Qm94PSItNjEgMCA1MTEgNTExLjk5OTYyIiB3aWR0aD0i%0D%0ANTExcHQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTM5MC4w%0D%0AMjM0MzggMTk0Ljc2MTcxOWMwIDY4LjU1NDY4Ny0zNS40MjE4NzYgMTI4LjgyODEyNS04OC45NTMx%0D%0AMjYgMTYzLjUzMTI1LTguMDYyNSA1LjIzODI4MS0xNC43OTY4NzQgMTIuMjY1NjI1LTE5LjUzNTE1%0D%0ANiAyMC42MjVsLTY5Ljk0NTMxMiAxMjMuNTYyNWMtLjE2MDE1Ni4yNzM0MzctLjMxNjQwNi41MzUx%0D%0ANTYtLjQ5NjA5NC44MDA3ODEtNy40NzI2NTYgMTEuODgyODEyLTI1LjEyODkwNiAxMS42MjEwOTQt%0D%0AMzIuMTYwMTU2LS44MDA3ODFsLTY5Ljk0NTMxMy0xMjMuNTYyNWMtNC43MjY1NjItOC4zNDc2NTct%0D%0AMTEuNDQ5MjE5LTE1LjM3ODkwNy0xOS41MDM5MDYtMjAuNTkzNzUtNTQuMzAwNzgxLTM1LjE4NzUt%0D%0AODkuOTc2NTYzLTk2LjY3NTc4MS04OC45NjQ4NDQtMTY2LjQzMzU5NCAxLjU5NzY1Ny0xMTEuMDUw%0D%0ANzgxIDk3LjUwMzkwNy0yMDAuMzk0NTMxIDIxMC41OTM3NS0xOTEuMjQ2MDk0IDEwMC4xNTIzNDQg%0D%0AOC4wNTQ2ODggMTc4LjkxMDE1NyA5MS44ODY3MTkgMTc4LjkxMDE1NyAxOTQuMTE3MTg4em0wIDAi%0D%0AIGZpbGw9IiNkNjMwMzAiLz48cGF0aCBkPSJtMzkwLjAyMzQzOCAxOTQuNzYxNzE5YzAgNjguNTU0%0D%0ANjg3LTM1LjQyMTg3NiAxMjguODI4MTI1LTg4Ljk1MzEyNiAxNjMuNTMxMjUtOC4wNjI1IDUuMjM4%0D%0AMjgxLTE0Ljc5Njg3NCAxMi4yNjU2MjUtMTkuNTM1MTU2IDIwLjYyNWwtNjkuOTQ1MzEyIDEyMy41%0D%0ANjI1Yy0uMTYwMTU2LjI3MzQzNy0uMzE2NDA2LjUzNTE1Ni0uNDk2MDk0LjgwMDc4MS0uMTc5Njg4%0D%0ALS4yNjU2MjUtLjMzOTg0NC0uNTI3MzQ0LS40OTYwOTQtLjgwMDc4MWwtNjkuOTQ1MzEyLTEyMy41%0D%0ANjI1Yy00LjcyNjU2My04LjM0NzY1Ny0xMS40NTMxMjUtMTUuMzc4OTA3LTE5LjUwMzkwNi0yMC41%0D%0AOTM3NS01NC4zMDQ2ODgtMzUuMTg3NS04OS45NzY1NjMtOTYuNjc1NzgxLTg4Ljk2NDg0NC0xNjYu%0D%0ANDMzNTk0IDEuNDQ1MzEyLTEwMC40NzY1NjMgODAuMDk3NjU2LTE4My4yMjI2NTYgMTc4LjkyOTY4%0D%0ANy0xOTEuMjQ2MDk0IDEwMC4xNTIzNDQgOC4wNTQ2ODggMTc4LjkxMDE1NyA5MS44ODY3MTkgMTc4%0D%0ALjkxMDE1NyAxOTQuMTE3MTg4em0wIDAiIGZpbGw9IiNmYjU4NTgiLz48cGF0aCBkPSJtMzM5LjA2%0D%0ANjQwNiAxOTQuNTMxMjVjMCA3OS40Mzc1LTY0LjQxMDE1NiAxNDMuODA0Njg4LTE0My44MDQ2ODcg%0D%0AMTQzLjgwNDY4OC03OS40MjE4NzUgMC0xNDMuODA0Njg4LTY0LjM4MjgxMy0xNDMuODA0Njg4LTE0%0D%0AMy44MDQ2ODggMC04NS4zNjcxODggNzQuMTAxNTYzLTE1Mi4zMTY0MDYgMTU5LjYzNjcxOS0xNDIu%0D%0AOTI5Njg4IDcxLjk2ODc1IDcuODg2NzE5IDEyNy45NzI2NTYgNjguODY3MTg4IDEyNy45NzI2NTYg%0D%0AMTQyLjkyOTY4OHptMCAwIiBmaWxsPSIjYzJlYWYyIi8+PHBhdGggZD0ibTMzOS4wNjY0MDYgMTk0%0D%0ALjUzMTI1YzAgNzQuMDcwMzEyLTU2LjAwMzkwNiAxMzUuMDU0Njg4LTEyNy45NzI2NTYgMTQyLjkz%0D%0ANzUtNzEuOTcyNjU2LTcuODgyODEyLTEyNy45NzI2NTYtNjguODY3MTg4LTEyNy45NzI2NTYtMTQy%0D%0ALjkzNzUgMC03NC4wNjI1IDU2LTEzNS4wNDI5NjkgMTI3Ljk3MjY1Ni0xNDIuOTI5Njg4IDcxLjk2%0D%0AODc1IDcuODg2NzE5IDEyNy45NzI2NTYgNjguODY3MTg4IDEyNy45NzI2NTYgMTQyLjkyOTY4OHpt%0D%0AMCAwIiBmaWxsPSIjZGVmNGY4Ii8+PHBhdGggZD0ibTIyMy42NzU3ODEgMTAzLjk4NDM3NXYxMTgu%0D%0AMDM5MDYzYzAgMTAuMjgxMjUtNS40NTcwMzEgMTkuMjg1MTU2LTEzLjYyODkwNiAyNC4yNzczNDMt%0D%0ANC4zMDQ2ODcgMi42Mjg5MDctOS4zNTkzNzUgNC4xMzY3MTktMTQuNzg1MTU2IDQuMTM2NzE5LTE1%0D%0ALjY5NTMxMyAwLTI4LjQxNDA2My0xMi43MTg3NS0yOC40MTQwNjMtMjguNDE0MDYydi0xMTguMDM5%0D%0AMDYzYzAtMTUuNjk1MzEzIDEyLjcxODc1LTI4LjQxNDA2MyAyOC40MTQwNjMtMjguNDE0MDYzIDIu%0D%0ANTU0Njg3IDAgNS4wMjM0MzcuMzM5ODQ0IDcuMzc4OTA2Ljk3MjY1NyA0Ljg4NjcxOSAxLjI5Njg3%0D%0ANSA5LjI0NjA5NCAzLjg3MTA5MyAxMi43MTQ4NDQgNy4zNDM3NSA1LjE0MDYyNSA1LjE1MjM0MyA4%0D%0ALjMyMDMxMiAxMi4yNDYwOTMgOC4zMjAzMTIgMjAuMDk3NjU2em0wIDAiIGZpbGw9IiNkNjMwMzAi%0D%0ALz48cGF0aCBkPSJtMjE1LjI5Mjk2OSAyOTEuNjAxNTYyYzAgNS44OTg0MzgtMi41NTQ2ODggMTEu%0D%0AMjA3MDMyLTYuNjA1NDY5IDE0Ljg3MTA5NC0zLjU1ODU5NCAzLjIwNzAzMi04LjI2NTYyNSA1LjE3%0D%0AMTg3NS0xMy40MjU3ODEgNS4xNzE4NzUtMTEuMDYyNSAwLTIwLjAzMTI1LTguOTcyNjU2LTIwLjAz%0D%0AMTI1LTIwLjA0Mjk2OSAwLTExLjA2MjUgOC45Njg3NS0yMC4wMzUxNTYgMjAuMDMxMjUtMjAuMDM1%0D%0AMTU2IDMuMTMyODEyIDAgNi4xMDE1NjIuNzE4NzUgOC43MzgyODEgMi4wMDc4MTMgNi42ODM1OTQg%0D%0AMy4yMzgyODEgMTEuMjkyOTY5IDEwLjEwMTU2MiAxMS4yOTI5NjkgMTguMDI3MzQzem0wIDAiIGZp%0D%0AbGw9IiNkNjMwMzAiLz48ZyBmaWxsPSIjZjQ0NTQ1Ij48cGF0aCBkPSJtMjIzLjY3NTc4MSAxMDMu%0D%0AOTg0Mzc1djExOC4wMzkwNjNjMCAxMC4yODEyNS01LjQ1NzAzMSAxOS4yODUxNTYtMTMuNjI4OTA2%0D%0AIDI0LjI3NzM0My0xMi4xMTMyODEtMy4yNDIxODctMjEuMDM1MTU2LTE0LjMwMDc4MS0yMS4wMzUx%0D%0ANTYtMjcuNDQxNDA2di0xMTguMDQyOTY5YzAtMTAuMjc3MzQ0IDUuNDU3MDMxLTE5LjI4MTI1IDEz%0D%0ALjYyODkwNi0yNC4yNzM0MzcgNC44ODY3MTkgMS4yOTY4NzUgOS4yNDYwOTQgMy44NzEwOTMgMTIu%0D%0ANzE0ODQ0IDcuMzQzNzUgNS4xNDA2MjUgNS4xNTIzNDMgOC4zMjAzMTIgMTIuMjQ2MDkzIDguMzIw%0D%0AMzEyIDIwLjA5NzY1NnptMCAwIi8+PHBhdGggZD0ibTIxNS4yOTI5NjkgMjkxLjYwMTU2MmMwIDUu%0D%0AODk4NDM4LTIuNTU0Njg4IDExLjIwNzAzMi02LjYwNTQ2OSAxNC44NzEwOTQtNi42Nzk2ODgtMy4y%0D%0ANDIxODctMTEuMjkyOTY5LTEwLjEwMTU2Mi0xMS4yOTI5NjktMTguMDM5MDYyIDAtNS44OTg0Mzgg%0D%0AMi41NTQ2ODgtMTEuMTk5MjE5IDYuNjA1NDY5LTE0Ljg1OTM3NSA2LjY4MzU5NCAzLjIzODI4MSAx%0D%0AMS4yOTI5NjkgMTAuMTAxNTYyIDExLjI5Mjk2OSAxOC4wMjczNDN6bTAgMCIvPjwvZz48L3N2Zz4=',
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
            iconUrl: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMnB0IiB2aWV3Qm94PSItNzYgMCA1MTIgNTEyIiB3aWR0aD0iNTEycHQi%0D%0AIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTMzNSA0MzdjMC00%0D%0AMS40MjE4NzUtNjkuMzk0NTMxLTc1LTE1NS03NXMtMTU1IDMzLjU3ODEyNS0xNTUgNzUgNjkuMzk0%0D%0ANTMxIDc1IDE1NSA3NSAxNTUtMzMuNTc4MTI1IDE1NS03NXptMCAwIiBmaWxsPSIjOTNkNDM3Ii8+%0D%0APHBhdGggZD0ibTE4MCAzNjJ2MTUwYzg1LjYwNTQ2OSAwIDE1NS0zMy41NzgxMjUgMTU1LTc1cy02%0D%0AOS4zOTQ1MzEtNzUtMTU1LTc1em0wIDAiIGZpbGw9IiM3NWJmMDAiLz48cGF0aCBkPSJtMTc5Ljk5%0D%0ANjA5NCA0NTEuNzIyNjU2Yy00LjQzMzU5NCAwLTguNjQwNjI1LTEuOTY0ODQ0LTExLjQ5MjE4OC01%0D%0ALjM1OTM3NWwtMTI2LjM5ODQzNy0xNTAuNjYwMTU2Yy0uMTMyODEzLS4xNjAxNTYtLjI2NTYyNS0u%0D%0AMzIwMzEzLS4zOTA2MjUtLjQ4ODI4MS0yNi45MDIzNDQtMzIuMjYxNzE5LTQxLjcxNDg0NC03My4x%0D%0ANTIzNDQtNDEuNzE0ODQ0LTExNS4yMTQ4NDQgMC05OS4yNTM5MDYgODAuNzQ2MDk0LTE4MCAxODAt%0D%0AMTgwczE4MCA4MC43NDYwOTQgMTgwIDE4MGMwIDQyLjEyNS0xNC44NTE1NjIgODMuMDcwMzEyLTQx%0D%0ALjgzMjAzMSAxMTUuMzU1NDY5LS4wOTM3NS4xMTcxODctLjE4NzUuMjM0Mzc1LS4yODUxNTcuMzQ3%0D%0ANjU2bC0xMjYuMzk0NTMxIDE1MC42NTYyNWMtMi44NTE1NjIgMy4zOTg0MzctNy4wNTg1OTMgNS4z%0D%0ANjMyODEtMTEuNDkyMTg3IDUuMzYzMjgxem0wIDAiIGZpbGw9IiMwMDkzZmYiLz48cGF0aCBkPSJt%0D%0AMTgwIDB2NDUxLjcxODc1YzQuNDMzNTk0IDAgOC42NDA2MjUtMS45NjA5MzggMTEuNDg4MjgxLTUu%0D%0AMzU5Mzc1bDEyNi4zOTQ1MzEtMTUwLjY1NjI1Yy4wOTc2NTctLjExMzI4MS4xOTE0MDctLjIyNjU2%0D%0AMy4yODUxNTctLjM0NzY1NiAyNi45ODA0NjktMzIuMjg1MTU3IDQxLjgzMjAzMS03My4yMzA0Njkg%0D%0ANDEuODMyMDMxLTExNS4zNTU0NjkgMC05OS4yNTM5MDYtODAuNzQ2MDk0LTE4MC0xODAtMTgwem0w%0D%0AIDAiIGZpbGw9IiMwMDdkZWYiLz48cGF0aCBkPSJtMTgwIDI3MWMtOC4yODUxNTYgMC0xNS02Ljcx%0D%0ANDg0NC0xNS0xNXYtMTYwYzAtOC4yODUxNTYgNi43MTQ4NDQtMTUgMTUtMTVzMTUgNi43MTQ4NDQg%0D%0AMTUgMTV2MTYwYzAgOC4yODUxNTYtNi43MTQ4NDQgMTUtMTUgMTV6bTAgMCIgZmlsbD0iI2Q3ZjBm%0D%0ANSIvPjxwYXRoIGQ9Im0xOTUgMzAxYzAgOC4yODUxNTYtNi43MTQ4NDQgMTUtMTUgMTVzLTE1LTYu%0D%0ANzE0ODQ0LTE1LTE1IDYuNzE0ODQ0LTE1IDE1LTE1IDE1IDYuNzE0ODQ0IDE1IDE1em0wIDAiIGZp%0D%0AbGw9IiNkN2YwZjUiLz48ZyBmaWxsPSIjYzNlMWViIj48cGF0aCBkPSJtMTk1IDI1NnYtMTYwYzAt%0D%0AOC4yODUxNTYtNi43MTQ4NDQtMTUtMTUtMTV2MTkwYzguMjg1MTU2IDAgMTUtNi43MTQ4NDQgMTUt%0D%0AMTV6bTAgMCIvPjxwYXRoIGQ9Im0xOTUgMzAxYzAtOC4yODUxNTYtNi43MTQ4NDQtMTUtMTUtMTV2%0D%0AMzBjOC4yODUxNTYgMCAxNS02LjcxNDg0NCAxNS0xNXptMCAwIi8+PC9nPjwvc3ZnPg==',
            iconSize: [30, 50],
            iconAnchor: [17, 70],
            popupAnchor: [12, -80],
          }),
        }).addTo(map);
        marker.bindPopup(popUpText).openPopup();
      });
    }

    if (this.props.neededServices.getAllNeededServices) {
      // console.log('data', prevProps.neededServices.getAllNeededServices)
      this.props.neededServices.getAllNeededServices.forEach((service) => {
        const coords = JSON.parse(service.addressCoords);
        const popUpText = `
        <h3>${service.title}</h3>
        <p>By: ${service.username}</p>
        <p>${service.description}</p>
        <p>${service.address}</p>
        `;
        // if (window) {
        const marker = window.tomtom.L.marker([coords.lat, coords.lon], {
          icon: window.tomtom.L.icon({
            iconUrl: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMXB0IiB2aWV3Qm94PSItNjEgMCA1MTEgNTExLjk5OTYyIiB3aWR0aD0i%0D%0ANTExcHQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTM5MC4w%0D%0AMjM0MzggMTk0Ljc2MTcxOWMwIDY4LjU1NDY4Ny0zNS40MjE4NzYgMTI4LjgyODEyNS04OC45NTMx%0D%0AMjYgMTYzLjUzMTI1LTguMDYyNSA1LjIzODI4MS0xNC43OTY4NzQgMTIuMjY1NjI1LTE5LjUzNTE1%0D%0ANiAyMC42MjVsLTY5Ljk0NTMxMiAxMjMuNTYyNWMtLjE2MDE1Ni4yNzM0MzctLjMxNjQwNi41MzUx%0D%0ANTYtLjQ5NjA5NC44MDA3ODEtNy40NzI2NTYgMTEuODgyODEyLTI1LjEyODkwNiAxMS42MjEwOTQt%0D%0AMzIuMTYwMTU2LS44MDA3ODFsLTY5Ljk0NTMxMy0xMjMuNTYyNWMtNC43MjY1NjItOC4zNDc2NTct%0D%0AMTEuNDQ5MjE5LTE1LjM3ODkwNy0xOS41MDM5MDYtMjAuNTkzNzUtNTQuMzAwNzgxLTM1LjE4NzUt%0D%0AODkuOTc2NTYzLTk2LjY3NTc4MS04OC45NjQ4NDQtMTY2LjQzMzU5NCAxLjU5NzY1Ny0xMTEuMDUw%0D%0ANzgxIDk3LjUwMzkwNy0yMDAuMzk0NTMxIDIxMC41OTM3NS0xOTEuMjQ2MDk0IDEwMC4xNTIzNDQg%0D%0AOC4wNTQ2ODggMTc4LjkxMDE1NyA5MS44ODY3MTkgMTc4LjkxMDE1NyAxOTQuMTE3MTg4em0wIDAi%0D%0AIGZpbGw9IiNkNjMwMzAiLz48cGF0aCBkPSJtMzkwLjAyMzQzOCAxOTQuNzYxNzE5YzAgNjguNTU0%0D%0ANjg3LTM1LjQyMTg3NiAxMjguODI4MTI1LTg4Ljk1MzEyNiAxNjMuNTMxMjUtOC4wNjI1IDUuMjM4%0D%0AMjgxLTE0Ljc5Njg3NCAxMi4yNjU2MjUtMTkuNTM1MTU2IDIwLjYyNWwtNjkuOTQ1MzEyIDEyMy41%0D%0ANjI1Yy0uMTYwMTU2LjI3MzQzNy0uMzE2NDA2LjUzNTE1Ni0uNDk2MDk0LjgwMDc4MS0uMTc5Njg4%0D%0ALS4yNjU2MjUtLjMzOTg0NC0uNTI3MzQ0LS40OTYwOTQtLjgwMDc4MWwtNjkuOTQ1MzEyLTEyMy41%0D%0ANjI1Yy00LjcyNjU2My04LjM0NzY1Ny0xMS40NTMxMjUtMTUuMzc4OTA3LTE5LjUwMzkwNi0yMC41%0D%0AOTM3NS01NC4zMDQ2ODgtMzUuMTg3NS04OS45NzY1NjMtOTYuNjc1NzgxLTg4Ljk2NDg0NC0xNjYu%0D%0ANDMzNTk0IDEuNDQ1MzEyLTEwMC40NzY1NjMgODAuMDk3NjU2LTE4My4yMjI2NTYgMTc4LjkyOTY4%0D%0ANy0xOTEuMjQ2MDk0IDEwMC4xNTIzNDQgOC4wNTQ2ODggMTc4LjkxMDE1NyA5MS44ODY3MTkgMTc4%0D%0ALjkxMDE1NyAxOTQuMTE3MTg4em0wIDAiIGZpbGw9IiNmYjU4NTgiLz48cGF0aCBkPSJtMzM5LjA2%0D%0ANjQwNiAxOTQuNTMxMjVjMCA3OS40Mzc1LTY0LjQxMDE1NiAxNDMuODA0Njg4LTE0My44MDQ2ODcg%0D%0AMTQzLjgwNDY4OC03OS40MjE4NzUgMC0xNDMuODA0Njg4LTY0LjM4MjgxMy0xNDMuODA0Njg4LTE0%0D%0AMy44MDQ2ODggMC04NS4zNjcxODggNzQuMTAxNTYzLTE1Mi4zMTY0MDYgMTU5LjYzNjcxOS0xNDIu%0D%0AOTI5Njg4IDcxLjk2ODc1IDcuODg2NzE5IDEyNy45NzI2NTYgNjguODY3MTg4IDEyNy45NzI2NTYg%0D%0AMTQyLjkyOTY4OHptMCAwIiBmaWxsPSIjYzJlYWYyIi8+PHBhdGggZD0ibTMzOS4wNjY0MDYgMTk0%0D%0ALjUzMTI1YzAgNzQuMDcwMzEyLTU2LjAwMzkwNiAxMzUuMDU0Njg4LTEyNy45NzI2NTYgMTQyLjkz%0D%0ANzUtNzEuOTcyNjU2LTcuODgyODEyLTEyNy45NzI2NTYtNjguODY3MTg4LTEyNy45NzI2NTYtMTQy%0D%0ALjkzNzUgMC03NC4wNjI1IDU2LTEzNS4wNDI5NjkgMTI3Ljk3MjY1Ni0xNDIuOTI5Njg4IDcxLjk2%0D%0AODc1IDcuODg2NzE5IDEyNy45NzI2NTYgNjguODY3MTg4IDEyNy45NzI2NTYgMTQyLjkyOTY4OHpt%0D%0AMCAwIiBmaWxsPSIjZGVmNGY4Ii8+PHBhdGggZD0ibTIyMy42NzU3ODEgMTAzLjk4NDM3NXYxMTgu%0D%0AMDM5MDYzYzAgMTAuMjgxMjUtNS40NTcwMzEgMTkuMjg1MTU2LTEzLjYyODkwNiAyNC4yNzczNDMt%0D%0ANC4zMDQ2ODcgMi42Mjg5MDctOS4zNTkzNzUgNC4xMzY3MTktMTQuNzg1MTU2IDQuMTM2NzE5LTE1%0D%0ALjY5NTMxMyAwLTI4LjQxNDA2My0xMi43MTg3NS0yOC40MTQwNjMtMjguNDE0MDYydi0xMTguMDM5%0D%0AMDYzYzAtMTUuNjk1MzEzIDEyLjcxODc1LTI4LjQxNDA2MyAyOC40MTQwNjMtMjguNDE0MDYzIDIu%0D%0ANTU0Njg3IDAgNS4wMjM0MzcuMzM5ODQ0IDcuMzc4OTA2Ljk3MjY1NyA0Ljg4NjcxOSAxLjI5Njg3%0D%0ANSA5LjI0NjA5NCAzLjg3MTA5MyAxMi43MTQ4NDQgNy4zNDM3NSA1LjE0MDYyNSA1LjE1MjM0MyA4%0D%0ALjMyMDMxMiAxMi4yNDYwOTMgOC4zMjAzMTIgMjAuMDk3NjU2em0wIDAiIGZpbGw9IiNkNjMwMzAi%0D%0ALz48cGF0aCBkPSJtMjE1LjI5Mjk2OSAyOTEuNjAxNTYyYzAgNS44OTg0MzgtMi41NTQ2ODggMTEu%0D%0AMjA3MDMyLTYuNjA1NDY5IDE0Ljg3MTA5NC0zLjU1ODU5NCAzLjIwNzAzMi04LjI2NTYyNSA1LjE3%0D%0AMTg3NS0xMy40MjU3ODEgNS4xNzE4NzUtMTEuMDYyNSAwLTIwLjAzMTI1LTguOTcyNjU2LTIwLjAz%0D%0AMTI1LTIwLjA0Mjk2OSAwLTExLjA2MjUgOC45Njg3NS0yMC4wMzUxNTYgMjAuMDMxMjUtMjAuMDM1%0D%0AMTU2IDMuMTMyODEyIDAgNi4xMDE1NjIuNzE4NzUgOC43MzgyODEgMi4wMDc4MTMgNi42ODM1OTQg%0D%0AMy4yMzgyODEgMTEuMjkyOTY5IDEwLjEwMTU2MiAxMS4yOTI5NjkgMTguMDI3MzQzem0wIDAiIGZp%0D%0AbGw9IiNkNjMwMzAiLz48ZyBmaWxsPSIjZjQ0NTQ1Ij48cGF0aCBkPSJtMjIzLjY3NTc4MSAxMDMu%0D%0AOTg0Mzc1djExOC4wMzkwNjNjMCAxMC4yODEyNS01LjQ1NzAzMSAxOS4yODUxNTYtMTMuNjI4OTA2%0D%0AIDI0LjI3NzM0My0xMi4xMTMyODEtMy4yNDIxODctMjEuMDM1MTU2LTE0LjMwMDc4MS0yMS4wMzUx%0D%0ANTYtMjcuNDQxNDA2di0xMTguMDQyOTY5YzAtMTAuMjc3MzQ0IDUuNDU3MDMxLTE5LjI4MTI1IDEz%0D%0ALjYyODkwNi0yNC4yNzM0MzcgNC44ODY3MTkgMS4yOTY4NzUgOS4yNDYwOTQgMy44NzEwOTMgMTIu%0D%0ANzE0ODQ0IDcuMzQzNzUgNS4xNDA2MjUgNS4xNTIzNDMgOC4zMjAzMTIgMTIuMjQ2MDkzIDguMzIw%0D%0AMzEyIDIwLjA5NzY1NnptMCAwIi8+PHBhdGggZD0ibTIxNS4yOTI5NjkgMjkxLjYwMTU2MmMwIDUu%0D%0AODk4NDM4LTIuNTU0Njg4IDExLjIwNzAzMi02LjYwNTQ2OSAxNC44NzEwOTQtNi42Nzk2ODgtMy4y%0D%0ANDIxODctMTEuMjkyOTY5LTEwLjEwMTU2Mi0xMS4yOTI5NjktMTguMDM5MDYyIDAtNS44OTg0Mzgg%0D%0AMi41NTQ2ODgtMTEuMTk5MjE5IDYuNjA1NDY5LTE0Ljg1OTM3NSA2LjY4MzU5NCAzLjIzODI4MSAx%0D%0AMS4yOTI5NjkgMTAuMTAxNTYyIDExLjI5Mjk2OSAxOC4wMjczNDN6bTAgMCIvPjwvZz48L3N2Zz4=',
            iconSize: [30, 50],
            iconAnchor: [17, 70],
            popupAnchor: [12, -80]
          })
        }).addTo(map);
        marker.bindPopup(popUpText)
        // }
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
    )

  }
}

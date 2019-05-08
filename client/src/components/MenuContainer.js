import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import ProvidedServiceModalMobile from '../containers/ProvidedServiceModalMobile';


export default class MenuContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceProvidedModal: false,
    };
  }

  handleProvidedServiceClick = () => {
    this.setState({ serviceProvidedModal: !this.state.serviceProvidedModal });
  };

  render() {
    return (
      <div className="menu-container">
        <h1 className="title">Grattis</h1>
        <p className="app-description">Welcome to Grattis! Grattis is an effort to help those in need by
          providing free services. Simply create a new service your are willing to offer free of charge. A
          maker should show up on the map with the information you provided. Map markers appear live in real-time!
        </p>
        <Button color="teal" onClick={() => this.handleProvidedServiceClick()}>Provide a service</Button>
        <ProvidedServiceModalMobile
          refetch={this.props.refetch}
          onClose={this.handleProvidedServiceClick}
          open={this.state.serviceProvidedModal}
        />
      </div>
    );
  }
}

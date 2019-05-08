import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

import ProvidedServiceModal from './ProvidedServiceModal';


export default class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceProvidedModal: false,
    };
  }

  handleProvideServiceClick = () => {
    this.setState({ serviceProvidedModal: !this.state.serviceProvidedModal });
  }


  render() {
    return (
      <div className="side-menu">
        <h1 className="title">Grattis</h1>
        <p className="app-description">Welcome to Grattis! Grattis is an effort to help those in need by
          providing free services. Simply create a new service your are willing to offer free of charge. A
          maker should show up on the map with the information you provided. Map markers appear live in real-time!
        </p>
        <Button color="teal" onClick={() => this.handleProvideServiceClick()}>Provide a service</Button>
        <ProvidedServiceModal
          refetch={this.props.refetch}
          onClose={this.handleProvideServiceClick}
          open={this.state.serviceProvidedModal}
        />
      </div>
    );
  }
}

import React, { Component } from 'react';
import ProvidedServiceModal from './ProvidedServiceModal';
import NeededServiceModal from './NeededServiceModal';

export default class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceProvidedModal: false,
      serviceNeededModal: false,
    };
  }

  handleProvideServiceClick = () => {
    this.setState({ serviceProvidedModal: !this.state.serviceProvidedModal });
  }

  handleNeededServiceClick = () => {
    this.setState({ serviceNeededModal: !this.state.serviceNeededModal });
  }

  render() {
    return (
      <div className="side-menu">
        <h1>Side Menu</h1>
        <p onClick={() => this.handleProvideServiceClick()}>Provide a service</p>
        <p onClick={() => this.handleNeededServiceClick()}>Ask for a service</p>
        <ProvidedServiceModal
          refetch={this.props.refetch}
          onClose={this.handleProvideServiceClick}
          open={this.state.serviceProvidedModal}
        />
        <NeededServiceModal
          onClose={this.handleNeededServiceClick}
          open={this.state.serviceNeededModal}
        />
      </div>
    );
  }
}

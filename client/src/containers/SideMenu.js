import React, { Component } from 'react';
import ProvidedServiceModal from './ProvidedServiceModal';


export default class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
  }

  handleProvideServiceClick = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
    console.log('modal is', this.state.isModalOpen);
  }

  render() {
    return (
      <div className="side-menu">
        <h1>Side Menu</h1>
        <p onClick={() => this.handleProvideServiceClick()}>Provide Service</p>
        <ProvidedServiceModal
          onClose={this.handleProvideServiceClick}
          open={this.state.isModalOpen}
        // onClose={this.handleProvideServiceClick}
        />
      </div>
    );
  }
}

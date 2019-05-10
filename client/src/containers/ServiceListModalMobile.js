import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Modal, Button, Form } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';


export default class ServiceListModalMobile extends Component {
  render() {
    let serviceList;
    if (this.props.data.getAllProvidedServices) {
      serviceList = this.props.data.getAllProvidedServices.map(
        service => <p>{service.title} By: {service.username} - Address: {service.address}</p>,
      );
    }
    return (
      <Modal open={this.props.open}>
        <Modal.Header>Current List of Services</Modal.Header>
        <Modal.Content>
          {serviceList}
          <Button onClick={this.props.onClose}>Cancel</Button>
        </Modal.Content>
      </Modal>
    );
  }
}

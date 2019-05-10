import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Modal, Button, Form } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';


const SERVICE_NEEDED_MUTATION = gql`
  mutation createNeededService(
    $title: String!, 
    $description: String!
    $address: String!
    $addressCoords: String!
    $username: String!
    ) {
   createNeededService(
      title: $title, 
      description: $description,
      address: $address,
      addressCoords: $addressCoords,
      username: $username
      ) 
  }
`;


export default class ProvidedServiceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      address: '',
      username: '',
    };
  }

  /* Set input vales to our state */
  onInputChange = (e) => {
    const { value } = e.target;
    const { name } = e.target;
    this.setState({
      [name]: value,
    });
  }

  getAddressCoords = async (address) => {
    const result = await fetch(`https://api.tomtom.com/search/2/geocode/${address}.json?limit=1&countrySet=US&lat=37.337&lon=-121.89&topLeft=37.553%2C-122.453&btmRight=37.4%2C-122.55&key=01ZXmKWLDr1TSBvi86xEvfIBv8DkMSX7`);
    const data = await result.json();
    return data.results[0].position;
  }

  /** Handle submitting a form by creating a mutation */
  handleSubmit = async (createNeededService) => {
    const {
      title,
      description,
      address,
      username,
    } = this.state;
    let addressCoords;

    const addressRegex = /^\s*\S+(?:\s+\S+){2}/;
    if (addressRegex.test(address)) {
      const coords = await this.getAddressCoords(address);
      addressCoords = JSON.stringify(coords);
    } else {
      alert('bad adress');
      return;
    }

    const response = await createNeededService({
      variables: {
        title,
        description,
        address,
        addressCoords,
        username,
      },
    });
    // // re-fetch data to set marker on map
    // this.props.refetch();
  }

  render() {
    return (
      <Mutation mutation={SERVICE_NEEDED_MUTATION}>
        {createNeededService => (
          <Modal open={this.props.open}>
            <Modal.Header>Ask For a Free Service</Modal.Header>
            <Modal.Content>
              <Form>
                <Form.Field>
                  <label>Service Name</label>
                  <input
                    name="title"
                    value={this.state.title}
                    onChange={this.onInputChange}
                    placeholder="Service Name"
                  />
                </Form.Field>
                <Form.Field>
                  <label>Username</label>
                  <input
                    name="username"
                    value={this.state.username}
                    onChange={this.onInputChange}
                    placeholder="Your Name"
                  />
                </Form.Field>
                <Form.Field>
                  <label>Description</label>
                  <input
                    name="description"
                    value={this.state.description}
                    onChange={this.onInputChange}
                    placeholder="Description"
                  />
                </Form.Field>
                <Form.Field>
                  <label>Address (street, city, state zip-code)</label>
                  <input
                    name="address"
                    value={this.state.address}
                    onChange={this.onInputChange}
                    placeholder="Address, ex: 2240 Dominion St, Durham, NC 27704"
                  />
                </Form.Field>
                <Button
                  type="submit"
                  onClick={() => { this.handleSubmit(createNeededService); this.props.onClose(); }}
                >Submit
                </Button>
                <Button onClick={this.props.onClose}>Cancel</Button>
              </Form>
            </Modal.Content>
          </Modal>
        )}
      </Mutation>
    );
  }
}

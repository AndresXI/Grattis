import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Modal, Button, Form } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';

const SERVICE_PROVIDED_MUTATION = gql`
  mutation createProvidedService(
    $title: String!, 
    $description: String!
    $address: String!
    $photoUrl: String!
    $username: String!
    ) {
   createProvidedService(
      title: $title, 
      description: $description,
      address: $address,
      photoUrl: $photoUrl,
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
      photoUrl: '',
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

  /** Handle submitting a form by creating a mutation */
  handleSubmit = async (createProvidedService) => {
    const {
      title,
      description,
      address,
      photoUrl,
      username,
    } = this.state;

    const response = await createProvidedService({
      variables: {
        title,
        description,
        address,
        photoUrl,
        username,
      },
    });
    console.log('response is', response);
  }

  render() {
    return (
      <Mutation mutation={SERVICE_PROVIDED_MUTATION}>
        {createProvidedService => (
          <Modal open={this.props.open} onClose={this.close}>
            <Modal.Header>Submit a service</Modal.Header>
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
                  <label>Address</label>
                  <input
                    name="address"
                    value={this.state.address}
                    onChange={this.onInputChange}
                    placeholder="Address"
                  />
                </Form.Field>
                <Form.Field>
                  <label>Photo Url</label>
                  <input
                    name="photoUrl"
                    value={this.state.photoUrl}
                    onChange={this.onInputChange}
                    placeholder="Photo url"
                  />
                </Form.Field>
                <Button
                  type="submit"
                  onClick={() => this.handleSubmit(createProvidedService)
                  }
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

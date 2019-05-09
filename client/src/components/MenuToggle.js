import React, { Component } from 'react';

export default class MenuToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggle: false,

    };
  }

  toggleMenuClass = (e) => {
    const nav = document.getElementById('nav-icon1');
    const sideMenu = document.getElementsByClassName('menu-container')[0];
    this.setState({ isToggle: !this.state.isToggle });
    if (!this.state.isToggle) {
      sideMenu.style.display = 'block';
    } else {
      sideMenu.style.display = 'none';
    }
    nav.classList.toggle('open');
  };

  render() {
    return (
      <div onClick={() => this.toggleMenuClass()} id="nav-icon1">
        <span />
        <span />
        <span />
      </div>
    );
  }
}

import React from 'react';

export default function MenuToggle() {
  let isToggle = false;
  const toggleMenuClass = (e) => {
    const nav = document.getElementById('nav-icon1');
    const sideMenu = document.getElementsByClassName('menu-container')[0];

    isToggle = !isToggle;
    if (isToggle) {
      sideMenu.style.display = 'block';
    } else {
      sideMenu.style.display = 'none';
    }
    nav.classList.toggle('open');
  };
  return (
    <div onClick={() => toggleMenuClass()} id="nav-icon1">
      <span />
      <span />
      <span />
    </div>
  );
}

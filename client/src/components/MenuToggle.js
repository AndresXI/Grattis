import React from 'react';

export default function MenuToggle() {
  const toggleMenuClass = (e) => {
    const nav = document.getElementById('nav-icon1');
    nav.classList.toggle('open');
    // e.target.classList.toggle('open');/
  };
  return (
    <div onClick={() => toggleMenuClass()} id="nav-icon1">
      <span />
      <span />
      <span />
    </div>
  );
}

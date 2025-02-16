import React from "react";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        {/* Brand Name */}
        <a className="navbar-brand navbar-logo" href="#">UpNextFM</a>

        {/* Navbar Items */}
        <div className="" id="navbarNav">

          {/* Account Icon on the Right */}
          <a className="btn navbar-icon">
            <i class="fa-sharp fa-regular fa-user"></i> Account
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


// import React, { useContext } from "react";
// import { Link } from "react-router-dom";
// import { UserContext } from "../UserContext"; // Adjust the path as necessary

// function Navbar() {
//   const { user } = useContext(UserContext);

//   return (
//     <nav className="navbar navbar-expand-lg">
//       <div className="container-fluid">
//         {/* Brand Name */}
//         <Link to="/" className="navbar-brand navbar-logo">
//           UpNextFM
//         </Link>

//         {/* Navbar Items */}
//         <div id="navbarNav">
//           {/* Account Icon on the Right */}
//           <Link to={user ? "/account" : "/signup"} className="btn navbar-icon">
//             <i className="fa-sharp fa-regular fa-user"></i>{" "}
//             {user ? user.username : "Account"}
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext"; // Adjust path as needed

function Navbar() {
  const { user } = useContext(UserContext);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tooltipRef]);

  const toggleTooltip = () => {
    setShowTooltip((prev) => !prev);
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        {/* Brand Name */}
        <Link to="/" className="navbar-brand navbar-logo">
          UpNextFM
        </Link>

        {/* Navbar Items */}
        <div id="navbarNav" className="ms-auto position-relative">
          {user ? (
            <div className="dropdown" ref={tooltipRef}>
              <button
                onClick={toggleTooltip}
                className="btn navbar-icon dropdown-toggle"
                style={{ border: "none", background: "none" }}
              >
                <i className="fa-sharp fa-regular fa-user"></i>{" "}
                {user.username}
              </button>
              {showTooltip && (
                <div className="dropdown-menu show" style={{ right: 0 }}>
                  <Link className="dropdown-item" to="/profile">
                    Profile
                  </Link>
                  <Link className="dropdown-item" to="/favorites">
                    Favorites
                  </Link>
                  <Link className="dropdown-item" to="/discover">
                    Discover
                  </Link>
                  <Link className="dropdown-item" to="/settings">
                    Settings
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signup" className="btn navbar-icon">
              <i className="fa-sharp fa-regular fa-user"></i> Account
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;




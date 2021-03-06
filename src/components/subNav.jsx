import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class SubNav extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light  navbar-transparent">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NavLink className="nav-item nav-link" to="/lang">
              Languages Used
            </NavLink>
            <NavLink className="nav-item nav-link" to="/category">
              Problem type
            </NavLink>
            <NavLink className="nav-item nav-link" to="/verdict">
              Verdicts
            </NavLink>
            <NavLink className="nav-item nav-link" to="/tags">
              Tags
            </NavLink>
            <NavLink className="nav-item nav-link" to="/unsolved">
              Unsolved
            </NavLink>
            <NavLink className="nav-item nav-link" to="/ratings">
              Ratings
            </NavLink>
          </div>
        </div>
      </nav>
    );
  }
}

export default SubNav;

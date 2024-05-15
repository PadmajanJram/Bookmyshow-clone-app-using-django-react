import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { removeUser } from "../store/authSlice";
import axios from "axios";

function Navbar() {
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      if (user) {
        await axios.post(
          "http://127.0.0.1:8000/movie/logout",
          {},
          {
            headers: { Authorization: "token " + user.token },
          }
        );
        dispatch(removeUser());
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink to={"/"} className="navbar-brand">
          SHOWMAN
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <NavLink
                    to={
                      user.username === "pappan" || user.userType === "admin"
                        ? "/listmovie"
                        : "/viewuser"
                    }
                    className="nav-link"
                    activeClassName="active"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to={
                      user.username === "pappan" || user.userType === "admin"
                        ? "/listmovie"
                        : "/bookings"
                    }
                    className="nav-link"
                    activeClassName="active"
                  >
                    Bookings
                  </NavLink>
                </li>
                <li className="nav-item">
                  <span className="nav-link cursor-pointer" onClick={logout}>
                    Logout
                  </span>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <NavLink
                  to={"/login"}
                  className="nav-link"
                  activeClassName="active"
                >
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

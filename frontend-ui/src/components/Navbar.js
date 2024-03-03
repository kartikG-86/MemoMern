import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authToken = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-5">
      <div className="container-fluid">
        <div className="col-lg-6">
          <Link className="navbar-brand" to="/">
            Memoir Catalog
          </Link>
        </div>

        <div className="col-lg-6 d-flex justify-content-end">
          {authToken ? (
            <button className="btn btn-primary mx-1" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <form className="d-flex">
              <Link
                className={`btn btn-primary mx-1 ${
                  location.pathname === "/" ? "disabled" : ""
                }`}
                to="/"
                role="button"
              >
                Login
              </Link>
              <Link
                className={`btn btn-primary mx-1 ${
                  location.pathname === "/signup" ? "disabled" : ""
                }`}
                to="/signup"
                role="button"
              >
                Signup
              </Link>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

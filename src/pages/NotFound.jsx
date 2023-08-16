import React from "react";
import { Link } from "react-router-dom";
import { HOME_PAGE } from "../constants";

const NotFound = () => {
  return (
    <div
      style={{ backgroundColor: "#123" }}
      className="text-capitalize text-white w-100 h-100 position-absolute d-flex flex-column justify-content-center align-items-center"
    >
      <h3>Page Not Found</h3>
      <p>
        please Go to Home Page{" "}
        <Link
          className="font-weight-bold"
          data-testid="home-page"
          to={HOME_PAGE}
        >
          home page
        </Link>
      </p>
    </div>
  );
};

export default NotFound;

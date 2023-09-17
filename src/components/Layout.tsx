import { Outlet, Link, useLoaderData } from "react-router-dom";

import "./styles/Layout.css";

const Layout = () => {
  const token = useLoaderData();

  if (token != null) {
    return (
      <>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/add-jewellery">Add Jewellery</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </ul>
        </nav>

        <Outlet />
      </>
    );
  } else {
    return (
      <>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        <Outlet />
      </>
    );
  }
};

export default Layout;
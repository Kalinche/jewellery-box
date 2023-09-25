import { useNavigate } from "react-router-dom";

import './Error.css';

const ErrorPage = () => {

  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="error-content">
        <h1 className="error-title">Error Page</h1>
        <h2 className="error-subtitle">404: Resource Not Found</h2>
        <button className="error-button" onClick={() => navigate("/")}>Home page</button>
      </div>
    </div>
  );
};

export default ErrorPage;

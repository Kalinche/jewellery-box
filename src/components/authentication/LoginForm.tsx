import React, { useEffect, useState } from "react";
import "./styles/Form.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  console.log("Token before login: ", sessionStorage.getItem('token'));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setter(e.target.value);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:2704/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.status === 401) {
        setError("Invalid username or password.");
      } else if (!response.ok) {
        setError("Login failed.");
        throw new Error(`Failed to login. Status: ${response.statusText}`);
      }

      const data = await response.json();

      const TOKEN_EXPIRATION_TIME = 3600000;

      if (data.token) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userId', data.userWithoutPassword._id);
        console.log("UserId in sessionStorage: " + sessionStorage.getItem("userId"));

        setTimeout(() => {
          console.log("Token expired. Removing information from sessionStorage.");
          sessionStorage.clear();
        }, TOKEN_EXPIRATION_TIME);

        window.location.replace("/");
      } else {
        throw new Error("Received response did not contain a token.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleLogin}>
        <label htmlFor="loginUsername">Username:</label>
        <input
          type="text"
          id="loginUsername"
          value={username}
          onChange={handleInputChange(setUsername)}
          required
        />
        <label htmlFor="loginPassword">Password:</label>
        <input
          type="password"
          id="loginPassword"
          value={password}
          onChange={handleInputChange(setPassword)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default Login;

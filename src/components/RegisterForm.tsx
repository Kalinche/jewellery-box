// Register.tsx
import React, { useState } from "react";
import "./styles/Form.css";
import { useNavigate } from 'react-router-dom';
import { User } from "../model/user.model";

const Register = () => {
  const [user, setUser] = useState<User>(new User("", ""));
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "username": "name" , "password" : "password"}),
      });
      const data = await response.json();
      console.log(data);
      // TODO: Handle response appropriately.
    } catch (error) {
      console.error("Error:", error);
    }

    navigate('/');
  };

  return (
    <div className="form-container">
      <form onSubmit={handleRegister}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={user.username}
          onChange={handleChange}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={user.password}
          onChange={handleChange}
          required
        />
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <input type="submit" value="Register" />
      </form>
    </div>
  );
};

export default Register;

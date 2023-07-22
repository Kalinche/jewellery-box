// Register.tsx
import React, { useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const response = await fetch('/register', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }) 
      });
      const data = await response.json();
      console.log(data);
      // TODO: Handle response appropriately.
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </label>
      <label>
        Confirm Password:
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
      </label>
      <input type="submit" value="Register" />
    </form>
  );
};

export default Register;

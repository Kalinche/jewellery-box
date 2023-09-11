import React, { useEffect, useState } from "react";
import "./styles/Form.css";
import { useNavigate } from 'react-router-dom';
import { UserDTO, validateEmail, validatePassword, validateRequiredFields } from "../../model/user.model";

const Register = () => {
  const initialUserState = new UserDTO({
    name: "",
    username: "",
    password: "",
    email: ""
  });

  const [user, setUser] = useState<UserDTO>(initialUserState);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
    setErrors([]);  // clear previous errors on input change
  };

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:2704/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }

    navigate('/login');
  };

  const validateForm: () => string[] = () => {
    const passwordErrors = validatePassword(user.password, confirmPassword);
    const emailErrors = validateEmail(user.email);
    const requiredFieldsErrors = validateRequiredFields(user);

    const problems = [...passwordErrors, ...emailErrors, ...requiredFieldsErrors];
    return problems;
  }

  return (
    <div className="form-container">
      <form onSubmit={handleRegister}>
        <label htmlFor="name">Name:<span className="required-star">*</span></label>
        <input
          type="text"
          id="name"
          name="name"
          value={user.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="username">Username:<span className="required-star">*</span></label>
        <input
          type="text"
          id="username"
          name="username"
          value={user.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="brandName">Brand Name:</label>
        <input
          type="text"
          id="brandName"
          name="brandName"
          value={user.brandName}
          onChange={handleChange}
        />

        <label htmlFor="password">Password:<span className="required-star">*</span></label>
        <input
          type="password"
          id="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="confirmPassword">Confirm Password:<span className="required-star">*</span></label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          name="bio"
          value={user.bio}
          onChange={handleChange}
        />

        <label htmlFor="email">Email:<span className="required-star">*</span></label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="gsm">GSM:</label>
        <input
          type="text"
          id="gsm"
          name="gsm"
          value={user.gsm}
          onChange={handleChange}
        />

        <label htmlFor="website">Website:</label>
        <input
          type="url"
          id="website"
          name="website"
          value={user.website}
          onChange={handleChange}
        />

        {errors.map((error, index) => (
          <p key={index} className="error-message">{error}</p>
        ))}
        <input type="submit" value="Register" />
      </form>
    </div >
  );
};

export default Register;

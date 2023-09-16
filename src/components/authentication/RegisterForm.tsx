import React, { useEffect, useState } from "react";
import "./styles/Form.css";
import { useNavigate } from 'react-router-dom';
import { UserDTO, validateEmail, validateGSM, validatePassword, validateRequiredFields } from "../../model/user.model";
import { toast } from 'react-toastify';

const Register = () => {
  const initialUserState = new UserDTO({
    name: "",
    username: "",
    brandName: "",
    password: "",
    bio: "",
    email: "",
    gsm: "",
    website: ""
  });

  const [user, setUser] = useState<UserDTO>(initialUserState);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:2704/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.status === 409) {
        const errorData = await response.json();
        toast.error(errorData.message);
      } else if (!response.ok) {
        toast.error(`Failed to register. Please try again later. Status: ${response.statusText}`);
      } else {
        const data = await response.json();
        console.log(data);
        toast.success("Successfully registered! Redirecting to login page...");

        setTimeout(() => {
          navigate('/login');
          setIsSubmitting(false);
        }, 3000);
      }
    } catch (error) {
      throw new Error("Error:" + error);
    }
  };

  const validateForm: () => string[] = () => {
    const passwordErrors = validatePassword(user.password, confirmPassword);
    const emailErrors = validateEmail(user.email);
    var gsmErrors: string[] = [];
    if (user.gsm) {
      gsmErrors = validateGSM(user.gsm);
    }
    const requiredFieldsErrors = validateRequiredFields(user);

    const problems = [...passwordErrors, ...emailErrors, ...gsmErrors, ...requiredFieldsErrors];
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
        <input type="submit" value="Register" disabled={isSubmitting} />
      </form>
    </div >
  );
};

export default Register;

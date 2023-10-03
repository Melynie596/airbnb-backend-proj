import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";
import { useHistory } from "react-router-dom";

function SignupFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .then(history.push('/'))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  let signupButton;

  if (username.length < 4 || password.length < 4 || !email || !firstName || !lastName || !confirmPassword) {
    signupButton = <button type="submit" disabled className="signup-button">Sign Up</button>
  } else {
    signupButton = <button type="submit" className="signup-button">Sign Up</button>
  }

  return (
    <div className="signup-form">
      <h1 className="signup-header">Sign Up</h1>
      <form className="signup-inputs"onSubmit={handleSubmit}>


          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

        {errors.email && <p className="error-message">{errors.email}</p>}

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />

        {errors.username && <p className="error-message">{errors.username}</p>}

          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
          />

        {errors.firstName && <p className="error-message">{errors.firstName}</p>}

          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
          />

        {errors.lastName && <p className="error-message">{errors.lastName}</p>}

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

        {errors.password && <p className="error-message">{errors.password}</p>}

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />

        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword}</p>
        )}
        <div>{signupButton}</div>
      </form>
    </div>
  );
}

export default SignupFormModal;

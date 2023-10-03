import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoSignIn = (e) => {
    setCredential('Demo-lition');
    setPassword('password');
  }

  let loginButton;

  if (credential.length < 4 || password.length < 6) {
    loginButton = <button type="submit" disabled className="login-buttons log-in">Log In</button>
  } else {
    loginButton = <button type="submit" className="login-buttons log-in">Log In</button>
  }


  return (
    <div className="login-form">
      <h1>Log In</h1>
      <form className="login-inputs" onSubmit={handleSubmit}>
          {errors.credential && <p>{errors.credential}</p>}
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <>{loginButton}</>
        <button className="login-buttons demo-user" type='submit' onClick={(e) => demoSignIn(e)}>Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;

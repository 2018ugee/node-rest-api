import axios from "axios";
import { useRef } from "react";
import { useHistory } from "react-router";
import "./register.css";

function Register() {
  const username = useRef();
  const name = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();

  const handleClick = async (e) => {
    e.preventDefault();
    if (password.current.value !== passwordAgain.current.value) {
      password.current.setCustomValidity("Passwords don't match");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("auth/register", user);
        history.push("/login");
        alert("LogIn using your credentials");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">P&Social</h3>
          <span className="registerDesc">
            Connect with friends and the world around you on P&Social.
          </span>
        </div>
        <div className="registerRight">
          <div className="registerBox">
            <form onSubmit={handleClick} className="registerForm">
              <input
                required
                ref={username}
                placeholder="Username"
                className="registerInput"
              />
              <input
                required
                ref={name}
                placeholder="Name"
                className="registerInput"
              />
              <input
                required
                ref={email}
                type="email"
                placeholder="Email"
                className="registerInput"
              />
              <input
                required
                ref={password}
                type="password"
                placeholder="Password"
                className="registerInput"
              />
              <input
                required
                ref={passwordAgain}
                type="password"
                placeholder="Confirm Password"
                className="registerInput"
              />
              <button type="submit" className="registerButton">
                Sign Up
              </button>
            </form>
            <button
              className="loginRegisterButton"
              onClick={() => {
                history.push("/login");
              }}
            >
              Log In to Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

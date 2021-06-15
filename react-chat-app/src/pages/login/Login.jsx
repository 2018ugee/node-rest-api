import { useContext, useRef, useState } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { useHistory } from "react-router";
import { Redirect } from "react-router-dom";
import axios from "axios";

function Login() {
  const email = useRef();
  const password = useRef();
  // const {user,isFetching,dispatch} = useContext(AuthContext);
  const { error, isFetching, dispatch } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const history = useHistory();

  const handleClick = async (e) => {
    e.preventDefault();
    // try {
    //   const res = await axios.post("auth/login", {
    //     email: email.current.value,
    //     password: password.current.value,
    //   });
    //   localStorage.setItem("user", JSON.stringify(res.data));
    //   //   history.push("/");
    //   history.goBack();
    // } catch (err) {
    //   alert(err);
    // }
    try {
      const logged = await loginCall(
        { email: email.current.value, password: password.current.value },
        dispatch
      );
      if (logged) {
        // history.push("/");
        window.location.reload();
      } else {
        alert("Wrong credentials");
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">P&Social</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on P&Social.
          </span>
        </div>
        <div className="loginRight">
          <div className="loginBox">
            <form className="loginForm" onSubmit={handleClick}>
              <input
                required
                placeholder="Email"
                className="loginInput"
                type="email"
                ref={email}
              />
              <input
                required
                placeholder="Password"
                className="loginInput"
                type="password"
                ref={password}
                minLength="5"
              />
              <button
                className="loginButton"
                type="submit"
                disabled={isFetching}
              >
                {isFetching ? (
                  <CircularProgress color="white" size="20px" />
                ) : (
                  "Log In"
                )}
              </button>
              {/* <span className="loginForgot">Forgot Password?</span> */}
            </form>
            <button
              className="loginRegisterButton"
              onClick={() => {
                history.push("/register");
              }}
            >
              Create a New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

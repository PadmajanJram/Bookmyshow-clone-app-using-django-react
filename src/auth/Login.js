import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { setUser } from "../store/authSlice";
import { useDispatch } from "react-redux";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogin(isAdmin) {
    axios
      .post("http://127.0.0.1:8000/movie/login", { username, password })
      .then((response) => {
        const { token, role } = response.data;
        const tokenKey = isAdmin ? "adminToken" : "userToken";
        localStorage.setItem(tokenKey, token);
        localStorage.setItem("role", role); // Store user's role
        navigate(role === "user" ? "/" : "/listmovie"); // Redirect based on role
        var user = {
          username: username,
          token: response.data.token,
        };
        dispatch(setUser(user));
      })
      .catch((error) => {
        console.error("axios error:", error);
        setErrorMessage("Invalid credentials");
      });
  }

  return (
    <>
      <Navbar />
      <div className="container card mt-5 p-5 ">
        <div className="row mt-5">
          <div className="col-8 offset-2">
            <h1 className="text-center">LOGIN</h1>
            <hr></hr>
            {errorMessage ? (
              <div className="alert alert-danger">{errorMessage}</div>
            ) : (
              ""
            )}
            <div className="form-group">
              <br></br>
              <label>Username:</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onInput={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onInput={(event) => setPassword(event.target.value)}
              />
            </div>
            <div className="form-group mt-4">
              <button
                className="btn btn-primary btn-block float-right"
                onClick={() => handleLogin(false)}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

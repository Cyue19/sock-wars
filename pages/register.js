import styles from "../styles/registrationpage.module.css";

import axios from "axios";
import Router from "next/router";
import { useState, useEffect } from "react";
import LoadButton from "./components/LoadButton";

const endPoint = process.env.NEXT_PUBLIC_REACT_APP_URL + "/auth/register";

export default function Register() {

  const [error, setError] = useState();
  const [btnLoading, setBtnLoading] = useState(false);
  const [confirmPw, setConfirmPw] = useState();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    gender: "",
    year: "",
    section: ""
  });

  function handleChange(e) {
    console.log(formData);
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }

  function onConfirmPwChanged(e) {
    setConfirmPw(e.target.value);
  }

  async function createUser(e) {
    e.preventDefault();
    setError(null);
    setBtnLoading(true);

    if (formData.password===confirmPw) {
      try {
        const response = await axios.post(endPoint, formData);
        Router.push("/");
      } catch(err) {
        setError(err.response.data.message);
        setBtnLoading(false);
      }
    } else {
      setError("Passwords do not match");
      setBtnLoading(false);
    }
    // console.log(formData);
  }

  return (
    <div>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <div class="container-fluid">
                    <a class="navbar-brand">Sock Wars</a>
                    
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    
                    
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" href="/immunity">Immunities</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/target">Target</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/elimpage">Report Elimination</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/">Leaderboard</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/rules">Rules</a>
                        </li>
                    </ul>
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Register</a>
                    </li>

                    <li class="nav-item">
                      <a class="nav-link" href="/login">Login</a>
                    </li>
                </div>
            </nav>
    <div className="p-5">
      <form style={{color: "white", margin: "auto", backgroundColor: "#2A3B4B"}} className="col-8 px-4 py-3" onSubmit={(e) => createUser(e)}>
        <h1 style={{textAlign: "center"}}>Create Account</h1>
        {error ? 
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        :
          <div></div>
        }

        <div className="row pb-2">
          <div className="col-md-6">
            <label for="firstName" class="form-label">
              First name
            </label>
            <input type="text" className="form-control" name="firstName" onChange={(e) => handleChange(e)} required />
          </div>
          <div className="col-md-6">
            <label for="lastName" class="form-label">
              Last name
            </label>
            <input type="text" className="form-control" name="lastName" onChange={(e) => handleChange(e)} required />
          </div>
        </div>

        <div className="row pb-2">
          <div className="col-md-6">
            <label for="userName" class="form-label">
              Username
            </label>
            <input type="text" className="form-control" name="userName" onChange={(e) => handleChange(e)} required />
          </div>
          <div className="col-md-6">
            <label for="email" class="form-label">
              Email
            </label>
            <input type="email" className="form-control" name="email" onChange={(e) => handleChange(e)} required />
          </div>
        </div>

        <div className="row pb-2">
          <div className="col-md-6">
            <label for="password" class="form-label">
              Password
            </label>
            <input type="password" className="form-control" name="password" onChange={(e) => handleChange(e)} required />
          </div>
          <div className="col-md-6">
            <label for="confirmPassword" class="form-label">
              Confirm password
            </label>
            <input type="password" className="form-control" name="confirmPassword" onChange={(e) => onConfirmPwChanged(e)} required />
          </div>
        </div>

        <div className="row pb-2">
          <div className="col-md-6">
            <label for="gender" class="form-label">
              Gender
            </label>
            <select className="form-control" name="gender" onChange={(e) => handleChange(e)} required>
              <option value="" disabled selected hidden>
                Select a gender...
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="col-md-6">
            <label for="year" className="form-label">
              Year
            </label>
            <select className="form-control" name="year" onChange={(e) => handleChange(e)} required>
              <option value="" disabled selected hidden>
                Select a year...
              </option>
              <option value="first">First </option>
              <option value="second">Second </option>
              <option value="third">Third </option>
              <option value="fourth">Fourth </option>
              <option value="other">Other </option>
            </select>
          </div>
        </div>

        <div className="row pb-3">
          <div className="col-md-6">
            <label for="section" className="form-label">
            Section
            </label>
            <select className="form-control" name="section" onChange={(e) => handleChange(e)} required>
              <option value="" disabled selected hidden>
                Select a section...
              </option>
              <option value="baritone">Baritone </option>
              <option value="clarinet">Clarinet </option>
              <option value="color guard and twirler">Color Guard and Twirler </option>
              <option value="drum major">Drum Major </option>
              <option value="drumline">Drumline </option>
              <option value="horn">Horn </option>
              <option value="piccolo">Piccolo </option>
              <option value="saxophone">Saxophone </option>
              <option value="staff">Staff </option>
              <option value="trombone">Trombone </option>
              <option value="trumpet">Trumpet </option>
              <option value="tuba">Tuba </option>
            </select>
          </div>
        </div>

        <div style={{textAlign: "center"}}>
          <LoadButton className="btn btn-warning col-6" type="submit" btnLoading={btnLoading}>Join!</LoadButton>
        </div>
      </form>
    </div>
    </div>
  );
}

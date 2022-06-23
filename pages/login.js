import styles from '../styles/login.module.css'

import { useState, useContext } from "react";
import Router from "next/router";
import axios from "axios";
//import { UserContext } from "./hooks/UserContext";

const endPoint = process.env.NEXT_PUBLIC_REACT_APP_URL + "/auth/login";

export default function Login() {
    const [error, setError] = useState();
    const [formData, setFormData] = useState({
      username: "",
      password: ""
    });

    //const { user, setUser } = useContext(UserContext);
  
    function handleChange(e) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  
    async function loginUser(e) {
      e.preventDefault();
      setError(null);

      try {
        const response = await axios.post(endPoint, formData);
        console.log(response.data);
        //setUser(response.data.user);
        Router.push("/");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } catch(err) {
          console.log(err.response.data.message);
          setError(err.response.data.message);
      }
      // console.log(formData);
    }

    return (
        <div>
            <h1 className={styles.h1}>Welcome to Sock Wars!</h1>

            <form onSubmit={(e)=>loginUser(e)}>
                <div className={styles.rulesContainer}>
                    <h2 style={{textAlign: "center", paddingLeft:"20px", paddingRight: "20px", marginTop: "auto", fontSize: "40px"}}>Sign in</h2>
                    {error ? 
                        <div className="alert alert-danger m-1" role="alert">
                            {error}
                        </div>
                    :
                        <div></div>
                    }
                
                    <div className={styles.username}>
                        <label>Username:</label>
                        <input type="text" className='form-control' placeholder= "Enter Username" onChange={(e)=>handleChange(e)} name="userName" required></input>
                    </div>

                    <div className={styles.password}>
                        <label>Password:</label>
                        <input type="password" className='form-control' placeholder= "Enter Password" onChange={(e)=>handleChange(e)} name="password" required></input>
                    </div>

                    <div className={styles.submit}>
                        <button type="submit">Login</button>
                    </div>

                    <div className={styles.notRegistered}>
                        Not registered? <a href='#'> click here </a>
                    </div>
                    
                </div>
            </form>
        </div>
    )
}
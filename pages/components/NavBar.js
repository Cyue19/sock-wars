import axios from "axios";
import { useContext } from "react";
import {UserContext} from "../hooks/UserContext";
import Router from "next/router";

const endPoint = process.env.NEXT_PUBLIC_REACT_APP_URL + "/auth/logout";

function NavBar(props) {
    const {user} = useContext(UserContext);

    async function logOut(e) {
        try {
            e.preventDefault();
            await axios.get(endPoint);
            Router.push("/login");
        } catch(err) {
            console.log(err.response);
        }
    }

    return(
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
                <div className="container-fluid">
                    <a className="navbar-brand">Sock Wars</a>
                    
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                          <a className={props.page==="index" ? "nav-link active":"nav-link"} href="/">Leaderboard</a>
                        </li>
                        <li className="nav-item">
                            <a className={props.page==="rules" ? "nav-link active":"nav-link"} href="/rules">Rules</a>
                        </li>
                        <li className="nav-item">
                            <a className={props.page==="games" ? "nav-link active":"nav-link"} href="/games">Games</a>
                        </li>
                        <li className="nav-item">
                            <a className={props.page==="target" ? "nav-link active":"nav-link"} href="/target">Target</a>
                        </li>
                        <li className="nav-item">
                            <a className={props.page==="immunities" ? "nav-link active":"nav-link"} href="/immunities">Immunities</a>
                        </li>
                        {user && user.role==="admin" ?
                            <li className="nav-item">
                                <a className={props.page==="create" ? "nav-link active":"nav-link"} href="/games/create">New Game</a>
                            </li>
                        :
                            <></>
                        }
                    </ul>

                    
                    {user ?
                        <div className="dropdown text-end">
                            <a href="#" className="d-block link-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-person-circle" style={{fontSize: "30px", color: "white"}}></i>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end text-small shadow">
                                <li><a className="dropdown-item" href="/settings">Settings</a></li>
                                <li><a className="dropdown-item" href="/notifications">Notifications</a></li>
                                <li><a className="dropdown-item" href={"/profile/" + user.userName}>Profile</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="#" onClick={(e) => logOut(e)}>Logout</a></li>
                            </ul>
                        </div>
                    :
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="/register">Register</a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="/login">Login</a>
                            </li>
                        </ul>
                    }
                  
                </div>
            </nav>
    );
}

export default NavBar;
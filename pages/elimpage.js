import styles from "../styles/confirmelim.module.css";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { GameContext } from "./hooks/GameContext";
import {UserContext} from "./hooks/UserContext";

const endPoint = process.env.NEXT_PUBLIC_REACT_APP_URL + "/games/";

export default function Gamehistory() {
  // const [gamehistory, setGamehistory] = useState();
  const [eliminatedPlyrs, setEliminatedPlyrs] = useState();
  const { currGame } = useContext(GameContext);
  const { user } = useContext(UserContext);

  const router = useRouter();

  useEffect(() => {
    try {
      fetchGamehistory();
    } catch (err) {
      console.log(err);
    }
  }, [user, currGame]);

  async function fetchGamehistory() {
    try {
      const response = await axios.get(endPoint);
      setEliminatedPlyrs(response.data.eliminatedPlayers);
      console.log(response.data.eliminatedPlayers);
      // setGamehistory(response.data);
      // console.log(response.data);
    } catch (err) {
      console.log(err);
      if (err.response) {
        console.log(err.response);
      }
    }
  }

  return (
    <div>

{user ? (
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
                          <a class="nav-link active" aria-current="page" href="#">Report Elimination</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="/">Leaderboard</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/rules">Rules</a>
                        </li>
                    </ul>
                    
                    <li class="nav-item">
                        <a class="nav-link" href="/settings">Settings</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Logout</a>
                    </li>
                    

                  
                </div>
            </nav>) : (
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
                          <a class="nav-link active" aria-current="page" href="#">Report Elimination</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="/">Leaderboard</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/rules">Rules</a>
                        </li>
                    </ul>
                    
                    <li class="nav-item">
                        <a class="nav-link" href="/register">Register</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="/login">Login</a>
                    </li>
                    
                    
                  
                </div>
            </nav>)}
      {currGame ? (
        <div>
          <title>Confirmed Eliminations</title>
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
            rel="stylesheet"
          ></link>

          <div className={styles.header}>
            <h1>Confirmed Eliminations</h1>
          </div>
          <div className={styles.box}>
            Game #:
            <h3>{currGame._id}</h3>
            {/* <h3>{gamehistory.eliminatedPlayers.username}</h3> */}
            <div className={styles.chart}>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Section</th>
                    <th>Eliminator</th>
                  </tr>
                </thead>
                <tbody>
                  {currGame.eliminatedPlayers.map((eliminatedPlyr) => (
                    <tr>
                      <td>
                        <div>{eliminatedPlyr.username}</div>
                      </td>
                      <td>
                        <div>{eliminatedPlyr.section}</div>
                      </td>
                      <td>
                        <div>{eliminatedPlyr.eliminator}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}

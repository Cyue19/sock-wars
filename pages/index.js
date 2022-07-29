import styles from "../styles/confirmelim.module.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { GameContext } from "./hooks/GameContext";
import { UserContext } from "./hooks/UserContext";
import { useRouter } from "next/router";

import NavBar from "./components/NavBar";

const endPoint = process.env.NEXT_PUBLIC_REACT_APP_URL + "/games/";

export default function Gamehistory() {
  const [activePlyrs, setActivePlyrs] = useState();
  const [game, setGame] = useState();
  const { prevGame, currGame } = useContext(GameContext);

  const router = useRouter();

  useEffect(() => {
    if (currGame) {
      setGame(currGame);
    } else if (prevGame) {
      setGame(prevGame);
    }

    // try {
    //   fetchGamehistory();
    // } catch (err) {
    //   console.log(err);
    // }
  }, [prevGame, currGame]);

  // async function fetchGamehistory() {
  //   try {
  //     const response = await axios.get(endPoint);
  //     setActivePlyrs(response.data.activePlayers);
  //     console.log(response.data.activePlayers);
  //   } catch (err) {
  //     console.log(err);
  //     if (err.response) {
  //       console.log(err.response);
  //     }
  //   }
  // }

  return (
    <div>
      {game ? (
        <div>
          <NavBar page="index" />
          <title>Leaderboard </title>
          <div className={styles.n}>
            <p>SOCK WARS</p>
          </div>

          <div className={styles.header}>
            <h1>LEADERBOARD</h1>
          </div>
          <div className={styles.box}>
            Game #:
            <h3>{game.title}</h3>
            <div className={styles.chart}>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Number Eliminated</th>
                  </tr>
                </thead>
                <tbody>
                  {game.activePlayers.map((activePlyr, index) => (
                    <tr>
                      <td>
                        <div>{index + 1}</div>
                      </td>
                      <td>
                        <div>{activePlyr.userName}</div>
                      </td>
                      <td>
                        <div>{activePlyr.eliminated}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.header}>
            <h1>Confirmed Eliminations</h1>
          </div>
          <div className={styles.box}>
            Game #:
            <h3>{game._id}</h3>
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
                  {game.eliminatedPlayers.map((eliminatedPlyr) => (
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

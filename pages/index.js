import styles from "../styles/confirmelim.module.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { GameContext } from "./hooks/GameContext";
import { UserContext } from "./hooks/UserContext";
import { useRouter } from "next/router";

import NavBar from "./components/NavBar";

const endPoint = process.env.NEXT_PUBLIC_REACT_APP_URL + "/games/";

export default function Gamehistory() {
  const [game, setGame] = useState();
  const { prevGame, currGame } = useContext(GameContext);

  const router = useRouter();

  useEffect(() => {
    if (currGame) {
      setGame(currGame);
    } else if (prevGame) {
      setGame(prevGame);
    }
  }, [prevGame, currGame]);

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
                  {game.activePlayers.map((player, index) => (
                    <tr>
                      <td>
                        <div>{index + 1}</div>
                      </td>
                      <td>
                        <div>{player.userName}</div>
                      </td>
                      <td>
                        <div>{player.score}</div>
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
                        <div>{eliminatedPlyr.userName}</div>
                      </td>
                      <td>
                        <div>{eliminatedPlyr.section}</div>
                      </td>
                      <td>
                        <div>{eliminatedPlyr.eliminator.userName}</div>
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

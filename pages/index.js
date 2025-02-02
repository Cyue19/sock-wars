// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import styles from "../styles/App.module.css";

// export default function App() {
//   const [APIdata, setAPIdata] = useState([]);

//   useEffect(() => {
//     axios
//       .get("https://sheet.best/api/sheets/fe557b31-4e38-489c-81db-d048fb75d6d8")
//       .then((incomingData) => {
//         setAPIdata(incomingData.data);
//       })
//       .catch((err)=> {
//         console.log(err.response);
//       });
//   }, []);

//   return (
//     <div>
//       <h1 className={styles.h1}>SOCK WARS</h1>
//       <h3 className={styles.h3}>
//         Today's Immunity: Wear 2 Different Color Socks!
//       </h3>
//       <h2 className={styles.h2}>LEADERBOARD</h2>

//       <table className={styles.table}>
//         <tr className={styles.trh}>
//           <th className={styles.th}>Rank</th>
//           <th className={styles.th}>Player</th>
//           <th className={styles.th}>Number Eliminated</th>
//         </tr>

//         {APIdata.map((data) => {
//           return (
//             <tr className={styles.tr}>
//               <td className={styles.td}>{data.Rank}</td>
//               <td className={styles.td}>{data.Player}</td>
//               <td className={styles.td}>{data.NumberEliminated}</td>
//             </tr>
//           );
//         })}
//       </table>

//       <table className={styles.table2}>
//         <tr className={styles.trh2}>
//           <th className={styles.th}>Eliminated Players</th>
//           <th className={styles.th}>Date Eliminated</th>
//         </tr>
//         {APIdata.map((data) => {
//           return (
//             <tr className={styles.tr2}>
//               <td className={styles.td}>{data.EliminatedPlayer}</td>
//               <td className={styles.td}>{data.EliminationDate}</td>
//             </tr>
//           );
//         })}
//       </table>
//     </div>
//   );
// }

import styles from "../styles/confirmelim.module.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { GameContext } from "./hooks/GameContext";
import { useRouter } from "next/router";

const endPoint = process.env.NEXT_PUBLIC_REACT_APP_URL + "/games/";

export default function Gamehistory() {
  const [activePlyrs, setActivePlyrs] = useState();
  const { currGame } = useContext(GameContext);

  const router = useRouter();

  useEffect(() => {
    try {
      fetchGamehistory();
    } catch (err) {
      console.log(err);
    }
  }, [currGame]);

  async function fetchGamehistory() {
    try {
      const response = await axios.get(endPoint);
      setActivePlyrs(response.data.activePlayers);
      console.log(response.data.activePlayers);
    } catch (err) {
      console.log(err);
      if (err.response) {
        console.log(err.response);
      }
    }
  }

  return (
    <div>
      {currGame ? (
        <div>
          <title>Leaderboard </title>
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
            rel="stylesheet"
          ></link>
          <div className={styles.n}>
            <p>SOCK WARS</p>
          </div>

          <div className={styles.header}>
            <h1>LEADERBOARD</h1>
          </div>
          <div className={styles.box}>
            Game #:
            <h3>{currGame._id}</h3>
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
                  {currGame.activePlayers.map((activePlyr, index) => (
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

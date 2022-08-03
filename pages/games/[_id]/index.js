import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../hooks/UserContext";
import axios from "axios";

import Spinner from "../../components/Spinner";
import EditModal from "../../components/EditModal.js";
import NavBar from "../../components/NavBar";

import styles from "../../../styles/Game.module.css";

const URL_PREFIX = process.env.NEXT_PUBLIC_REACT_APP_URL;
const endPoint = process.env.NEXT_PUBLIC_REACT_APP_URL + "/games/";
const matchEndPoint = process.env.NEXT_PUBLIC_REACT_APP_URL + "/match";
const assignEndPoint = process.env.NEXT_PUBLIC_REACT_APP_URL + "/users/assignTarget";
const unjoinEndPoint = process.env.NEXT_PUBLIC_REACT_APP_URL + "/games/unjoin";

export default function Gamehistory() {
  const [gamehistory, setGamehistory] = useState({}); //the info about the game
  const [gameEdit, setGameEdit] = useState({}); //the game object that will be edited
 
  // const [disableJoin, setDisableJoin] = useState(false); //will be used to disable the join button if the game has already started
  const [game, setGame] = useState();
  const [userGame, setUserGame] = useState();
  const [hasJoined, setHasJoined] = useState(false);
  const [lockDate, setLockDate] = useState();
  const [error, setError] = useState();

  const { user } = useContext(UserContext);

  const router = useRouter();
  const { _id } = router.query;

  useEffect(() => {
    //setUser(JSON.parse(localStorage.user))
    try {
      if (_id) {
        if (user) {
          for (var i=0; i<user.gamesPlayed.length; i++) {
            if (user.gamesPlayed[i].gameId===_id) {
              setHasJoined(true);
              setUserGame(user.gamesPlayed[i]);
              break;
            }
          }
        }

        fetchGame();
      }
    } catch (err) {
      console.log(err);
    }
  }, [_id, user]); //https://stackoverflow.com/questions/53601931/custom-useeffect-second-argument
    //if _id has changed then get new user

  async function fetchGame() {
    try {
      const response = await axios.get(endPoint + _id);
      //response.data.shortStartDate = response.data.startDate.substring(0, 10)
      //response.data.shortEndDate = response.data.endDate.substring(0, 10)
      const g = response.data
      // if(g.startDate.slice(-1) === 'Z') //remove timezone character
      //   g.startDate = g.startDate.slice(0, -1)
      // if(g.endDate.slice(-1) === 'Z')
      //   g.endDate = g.endDate.slice(0, -1)
      console.log(g)
      // setGamehistory(g);
      setGameEdit(g);
      var current = new Date();
      var gameStart = new Date(response.data.startDate);
      const disable = gameStart < current;
      // setDisableJoin(disable); 
      var date = new Date(response.data.startDate);
      date.setDate( date.getDate() - 1 );
      setLockDate(date);
      setGame(response.data);
      console.log(typeof(response.data.startDate));
    } catch (err) {
      console.log(err);
    }
  }

  const joinGame = () => {
    axios
      .patch(URL_PREFIX + "/games/join", {
        _id: _id,
        user: user,
      })
      .then((response) => {
        setHasJoined(true);
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
    
  async function unjoin() {
    try {
      const response = await axios.patch(unjoinEndPoint, {gameId: _id, userName: user.userName});
      setHasJoined(false);
      console.log(response.data);
    } catch(err) {
      console.log(err.response.data);
    }
  }

  async function matchPlayers() {
    try {
        setError(null);
        const response = await axios.post(matchEndPoint, {gameId: _id});
        console.log(response.data);
        assignTargets(response.data);
    } catch(err) {
        setError(err.response.data.message);
        console.log(err.response);
    }
  }

  async function assignTargets(matches) {
    try {
      const response = await axios.patch(assignEndPoint, {matches: matches, gameId: _id});
      console.log(response.data);
    } catch(err) {
      console.log(err.response.data);
    }

  }

  return (
    <div>
      <NavBar page="game" />
      {game && lockDate && user  ? 
        <div className="container px-5">

          {error ? 
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
            :
            <div></div>
          }

          <div style={{textAlign: "center"}}>
            {/* <h1 className="text-center mb-3 me-2" style={{color: "white", display: "inline-block", textAlign: "center"}}>Game Summary</h1> */}
            <div className="row">
                <div className="col-5 text-center" style={{ margin: "auto", color: "white"}}>
                  <h1 style={{ marginBottom: "0"}}>{game.title}</h1>
                  <span style={{fontSize: "14px"}}>
                    <span style={{color: "#f8c40c"}}>Start:</span> {new Date(game.startDate).toLocaleString()} <span style={{color: "#f8c40c"}}>Status:</span> {game.status}
                  </span>
                </div>
              </div>
          </div>

          <div className=" mt-0 mx-5">
            <div className="row">
              <div className="col">
                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active" style={{borderRadius: "0"}} id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">General</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button class="nav-link" style={{borderRadius: "0"}} id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Eliminations</button>
                  </li>
                </ul>
              </div>
              <div className="col">
                {user.role==="user" ?
                  <>
                    {hasJoined ?
                    <button type="button" className="btn btn-danger btn-sm" onClick={unjoin} style={{float: "right", marginTop: "3px", marginBottom: "10px",}} disabled = {new Date() > lockDate}>
                      Leave Game
                    </button>
                    :
                    <button type="button" className="btn btn-primary btn-sm" onClick={joinGame} style={{float: "right", marginTop: "3px", marginBottom: "10px",}} disabled = {new Date() > lockDate}>
                      Join Game
                    </button>
                    }
                  </>
                :
                  <button type="button" className="btn btn-primary btn-sm text-center" onClick={matchPlayers} style={{float: "right", marginTop: "3px", marginBottom: "10px",}} disabled = {new Date() < lockDate || game.status!=="pending"}>
                    Match Targets
                  </button>
                }
              </div>
            </div>
          </div>

          <div className="tab-content mb-5 mx-5" id="pills-tabContent" style={{backgroundColor: "rgb(239, 229, 189)"}}>
            <div className="tab-pane fade show active pb-4 px-4 pt-3" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex="0">
              <div className="row">
                <div className="col-3">
                  <h3 style={{fontSize: "18px"}}>Active Players</h3>
                  <div className={styles.formCard}>
                    <div className={styles.scroll}>
                      {game.activePlayers.map((player) => (
                        <p style={{margin: "0px"}}>{player.userName}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-3">
                  <h3 style={{fontSize: "18px"}}>Eliminated Players</h3>
                  <div className={styles.formCard}>
                    <div className={styles.scroll}>
                      {game.eliminatedPlayers.map((player, i) => (
                        <p style={{margin: "0px"}}>{player.username}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col">
                  <h3 style={{fontSize: "18px"}}>Immunities</h3>
                  <div className={styles.formCard} style={{backgroundColor: "white"}}>
                    <div style={{height: "250px"}}>
                      {game.immunities.map((immunity) => (
                        <p style={{margin: "0px"}}>Day {i+1}: {immunity}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="tab-pane fade p-4 px-5" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex="0">
              <div className={styles.formCard} style={{width: "fit-content", margin: "auto"}}>
                <table className="table table-sm table-striped text-center">
                  <tbody>
                    {game.eliminatedPlayers.map((player) => (
                      <tr>
                        <td>
                          <div>{player.username} was eliminated by {player.eliminator}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>








          

          {/* <div className="card" border="0" width="300px" style={{ backgroundColor: "rgb(239, 229, 189)"}}>

            <EditModal
              gameEdit={gameEdit}
              handleDateChange={handleDateChange}
              addImmunity={addImmunity}
              editImmunity={editImmunity}
              removeImmunity={removeImmunity}
              submitEdits={submitEdits}
              addActivePlayer={addActivePlayer}
              editActivePlayer={editActivePlayer}
              removeActivePlayer={removeActivePlayer}
              addElimPlayer={addElimPlayer}
              editElimPlayer={editElimPlayer}
              removeElimPlayer={removeElimPlayer}
            />
            <EditModal
              gameEdit={gameEdit}
            />
            {user.role==="user" ?
              <>
                {hasJoined ?
                <button type="button" className="btn btn-danger" onClick={unjoin} style={{marginTop: "3px", marginBottom: "10px",}} disabled = {new Date() > lockDate}>
                  Leave Game
                </button>
                :
                <button type="button" className="btn btn-primary" onClick={joinGame} style={{backgroundColor: "rgb(45, 64, 83)", marginTop: "3px", marginBottom: "10px",}} disabled = {new Date() > lockDate}>
                  Join Game
                </button>
                }
              </>
            :
              <button type="button" className="btn btn-primary" onClick={matchPlayers} style={{backgroundColor: "rgb(45, 64, 83)", marginTop: "3px", marginBottom: "10px",}} disabled = {new Date() < lockDate || game.status!=="pending"}>
                Match Targets
              </button>
            }

            <span className="text-muted d-block mb-2 text-center">
              <p>Game #: {game._id}</p>
            </span>
            <div className="user text-center">
              <div className="profile" style={{ paddingTop: "10px" }}>
                <img
                  src="https://www.bootdey.com/app/webroot/img/Content/icons/64/PNG/64/tactics.png"
                  width="75"
                />
              </div>
            </div>
            <div className="mt-5 text-center">
              <h4 className="mb-0">
                {new Date(game.startDate).toLocaleString()}
              </h4>
              <span className="text-muted d-block mb-2">
                Active Players:
                {game.activePlayers.map((player) => (
                  <div key={player.userName}>{player.userName}</div>
                ))}
                {game.activePlayers.length===0 ?
                  <div>None</div>
                  :
                  <div></div>
                }
              </span>

              <span className="text-muted d-block mb-2">
                Eliminated Players:
                {game.eliminatedPlayers.map((player) => (
                  <div key={player.userName}>{player.userName}</div>
                ))}
                {game.eliminatedPlayers.length===0 ?
                  <div>None</div>
                  :
                  <div></div>
                }
              </span>
              <div className="d-flex justify-content-between align-items-center mt-4 px-4"></div>
            </div>
            <div
              className="card"
              border="20"
              style={{ backgroundColor: "rgb(119, 136, 153)" }}
            >
              <h6 className="mb-0">Immunities: </h6>
            </div>
          </div> */}
        </div>
      : 
        <Spinner/>
      }
    </div>
  )
}
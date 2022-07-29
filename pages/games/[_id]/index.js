import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../hooks/UserContext";
import axios from "axios";

import Spinner from "../../components/Spinner";
import styles from "../../../styles/profile.module.css";
import EditModal from "../../components/EditModal.js";
import NavBar from "../../components/NavBar";

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

  const handleDateChange = (e, key) => {
    //console.log(gamehistory)
    setGameEdit((prevState) => ({
      ...prevState,
      [key]: e.target.value,
    }));
  }

  const addImmunity = (value) => { 
    setGameEdit((prevState) => ({
      ...prevState,
      immunities: [...prevState.immunities, value]
    }));
  }

  const editImmunity = (e, i) => { //i to track which immunity to edit
    const immunities = gameEdit.immunities.map((imm, idx) => {
      if(idx === i)
        return e.target.value
      else 
        return imm
    })
    setGameEdit((prevState) => ({
      ...prevState,
      immunities: immunities
    }))
  }

  const removeImmunity = (i) => {
    // console.log(i)
    // setGameEdit(prevState => {
    //   const copy = prevState
    //   copy.immunities.splice(i, 1)
    //   console.log(copy)
    //   return copy
    // })
    const immunities = gameEdit.immunities.filter((imm, idx) => idx !== i)
    console.log(immunities)
    setGameEdit((prevState) => ({
        ...prevState,
        immunities: immunities
    }))
  }

  const addActivePlayer = (value) => { 
    const el = gameEdit.eliminatedPlayers.filter((plyr, idx) => plyr.userName === value) 
    if(el.length === 0) { //if player doesnt exist in activePlayers
      const newPlayer = {userName: value}
      setGameEdit((prevState) => ({
        ...prevState,
        activePlayers: [...prevState.activePlayers, newPlayer]
      }));
    }
  }

  const editActivePlayer = (e, i) => { //i to track which player to edit
    const ac = gameEdit.activePlayers.map((plyr, idx) => {
      if(idx === i)
        return {userName: e.target.value}
      else 
        return plyr
    })
    console.log(ac)
    setGameEdit((prevState) => ({
      ...prevState,
      activePlayers: ac
    }))
  }

  const removeActivePlayer = (i) => {
    const ac = gameEdit.activePlayers.filter((plyr, idx) => idx !== i)
    console.log(ac)
    setGameEdit((prevState) => ({
        ...prevState,
        activePlayers: ac
    }))
  }

  const addElimPlayer = (value) => {
    const ac = gameEdit.activePlayers.filter((plyr, idx) => plyr.userName === value) 
    if(ac.length === 0) { //if player doesnt exist in activePlayers
      setGameEdit((prevState) => ({
        ...prevState,
        eliminatedPlayers: [...prevState.eliminatedPlayers, {userName: value}]
      }));
    }
  }

  const editElimPlayer = (e, i) => { //i to track which player to edit
    const el = gameEdit.eliminatedPlayers.map((plyr, idx) => {
      if(idx === i)
        return {userName: e.target.value}
      else 
        return plyr
    })
    setGameEdit((prevState) => ({
      ...prevState,
      eliminatedPlayers: el
    }))
  }

  const removeElimPlayer = (i) => {
    const el = gameEdit.eliminatedPlayers.filter((plyr, idx) => idx !== i)
    setGameEdit((prevState) => ({
        ...prevState,
        eliminatedPlayers: el
    }))
  }

  const submitEdits = async () => {
    let ap_urls = [] //urls for Active Players
    for(const ap of gameEdit.activePlayers) {
      const req = axios.get(URL_PREFIX + "/users/" + ap.userName);
      ap_urls.push(req)
    }
    let ep_urls = [] //urls for Eliminated Players
    for(const ep of gameEdit.eliminatedPlayers) {
      const req = axios.get(URL_PREFIX + "/users/" + ep.userName);
      ep_urls.push(req)
    }
    let actives = [];
    await Promise.all(ap_urls)
      .then((players) => {
        for(const p of players) {
          actives.push({
            id: p.data._id,
            userName: p.data.userName,
            section: p.data.section
          })
        }
      })
      .catch((error) => {
        console.log(error)
      });
    let elims = [];
    await Promise.all(ep_urls)
      .then((players) => {
        for(const p of players) {
          elims.push({
            id: p.data._id,
            userName: p.data.userName,
            section: p.data.section
          })
        }
      })
      .catch((error) => {
        console.log(error)
      });
    try {
      const response = await axios.patch(URL_PREFIX + "/games/editgame", {
        _id: _id,
        activePlayers: actives,
        eliminatedPlayers: elims,
        startDate: gameEdit.startDate,
        endDate: gameEdit.endDate,
        immunities: gameEdit.immunities,
      });
      console.log(response.data);
    } catch(err) {
      console.log(err.response.data);
    }
  }
    
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
      {game && lockDate && user  ? (
        <div className="container px-5 pt-3" style={{width: "50%" }}>

          {error ? 
            <div class="alert alert-danger" role="alert">
              {error}
            </div>
            :
            <div></div>
          }
          
          <div
            className="card"
            border="0"
            width="300px"
            style={{ backgroundColor: "rgb(239, 229, 189)"}}
          >

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
            <div className="upper"></div>
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
              {/* <span>{gamehistory.immunities}</span> */}
            </div>
          </div>
        </div>
      ) : (
        <Spinner/>
      )}
    </div>
  )
}
import { useState, useEffect } from "react";

export default function EditModal(props) {
    const [immunity, setImmunity] = useState(""); //the immunity to be added
    const [activePlayer, setActivePlayer] = useState("");
    const [elimPlayer, setElimPlayer] = useState("");

    const immunityTextHandler = (event) => {
        setImmunity(event.target.value)
    }

    const activePlayerHandler = (event) => {
        setActivePlayer(event.target.value)
    }

    const elimPlayerHandler = (event) => {
        setElimPlayer(event.target.value)
    }

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

    return (
        <div>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Edit Game
            </button>

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Edit Game</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                                <a class="nav-link active" href="#immunities" aria-controls="immunities" role="tab" data-bs-toggle="tab">Immunities</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#dates" aria-controls="dates" role="tab" data-bs-toggle="tab">Dates</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#players" aria-controls="players" role="tab" data-bs-toggle="tab">Players</a>
                            </li>
                        </ul>
                        {/* <div class="tab-content">
                            <div role="tabpanel" class="tab-pane active" id="home">Home</div>
                            <div role="tabpanel" class="tab-pane" id="dates">Profile</div>
                            <div role="tabpanel" class="tab-pane" id="messages">Messages</div>
                            <div role="tabpanel" class="tab-pane" id="settings">Settings</div>
                        </div> */}
                        <div class="tab-content">
                            <div role="tabpanel" class="tab-pane active" id="immunities">
                                <p></p>
                                <textarea placeholder="Add immunity here" class="form-control" id="immunity" rows="2" onChange={immunityTextHandler} value={immunity}></textarea>
                                <div>
                                    <button className="btn btn-primary btn-sm" style={{marginTop:"5px", float:"right"}} 
                                    onClick={() => {
                                        addImmunity(immunity);
                                        setImmunity("");
                                    }}>
                                        Add
                                    </button>
                                    <div style={{clear:"both"}}></div>
                                </div>
                                <label>Edit/Remove Immunities</label>
                                {props.gameEdit && props.gameEdit.immunities.map((imm, i) => (
                                    <div style={{marginTop:"5px"}}>
                                        <input
                                            type="text"
                                            value={imm}
                                            onChange={e => editImmunity(e, i)}
                                            style={{width:"70%"}}
                                        />
                                        <button className="btn btn-outline-danger btn-sm" style={{marginLeft:"5px", float:"right"}} onClick={()=>{removeImmunity(i)}}>
                                            Del
                                        </button> 
                                    </div>
                                ))}
                            </div>
                            <div role="tabpanel" class="tab-pane" id="dates">
                                <div className="col-7">
                                    <label for="startDate" class="form-label">Start Date</label>
                                    <input type="datetime-local" className="form-control" id="startDate" 
                                        //defaultValue="2022-06-09T05:09:00.00"
                                        defaultValue={props.gameEdit ? props.gameEdit.startDate : ""}
                                        onChange={(e) => handleDateChange(e, 'startDate')}
                                    />
                                </div>
                                <div className="col-7">
                                    <label for="endDate" class="form-label">End Date</label>
                                    <input type="datetime-local" className="form-control" id="endDate" 
                                        //value={props.data ? props.data.endDate : ""}
                                        defaultValue={props.gameEdit ? props.gameEdit.endDate : ""}
                                        onChange={(e) => handleDateChange(e, 'endDate')}
                                    />
                                </div>
                            </div>
                            <div role="tabpanel" class="tab-pane" id="players">
                                <p></p>
                                <label>Add user to active players</label>
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" placeholder="Enter username" onChange={activePlayerHandler} value={activePlayer}/>
                                    <div class="input-group-append">
                                        <button class="btn btn-primary" type="button"
                                        onClick={() => {
                                            addActivePlayer(activePlayer);
                                            setActivePlayer("");
                                        }}>
                                        Add</button>
                                    </div>
                                </div>
                                <label>Edit/Remove Active Player</label>
                                {props.gameEdit && props.gameEdit.activePlayers.map((usr, i) => (
                                    <div style={{marginTop:"5px"}}>
                                        <input
                                            type="text"
                                            value={usr.userName}
                                            onChange={e => editActivePlayer(e, i)}
                                            style={{width:"70%"}}
                                        />
                                        <button className="btn btn-outline-danger btn-sm" style={{marginLeft:"5px", float:"right"}} onClick={()=>{removeActivePlayer(i)}}>
                                            Del
                                        </button> 
                                    </div>
                                ))}
                                <p></p>
                                <label>Add user to eliminated players</label>
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" placeholder="Enter username" onChange={elimPlayerHandler} value={elimPlayer}/>
                                    <div class="input-group-append">
                                        <button class="btn btn-primary" type="button"
                                        onClick={() => {
                                            addElimPlayer(elimPlayer);
                                            setElimPlayer("");
                                        }}>
                                        Add</button>
                                    </div>
                                </div>
                                <label>Edit/Remove eliminated player</label>
                                {props.gameEdit && props.gameEdit.eliminatedPlayers.map((usr, i) => (
                                    <div style={{marginTop:"5px"}}>
                                        <input
                                            type="text"
                                            value={usr.userName}
                                            onChange={e => editElimPlayer(e, i)}
                                            style={{width:"70%"}}
                                        />
                                        <button className="btn btn-outline-danger btn-sm" style={{marginLeft:"5px", float:"right"}} onClick={()=>{removeElimPlayer(i)}}>
                                            Del
                                        </button> 
                                    </div>
                                ))}
                            </div>
                        </div> 
                        
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onClick={submitEdits}>Save changes</button>
                    </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
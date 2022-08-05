import { useState, useEffect } from 'react';
import axios from "axios";
import NavBar from "../components/NavBar";

const URL_PREFIX = process.env.NEXT_PUBLIC_REACT_APP_URL;
const notifEndPoint = process.env.NEXT_PUBLIC_REACT_APP_URL + "/notifications/sendAll";

function Create() {
  const [startDate, setStartDate] = useState('');
  const [title, setTitle] = useState("");
  const [immunities, setImmunities] = useState([""]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
  }, []);

  const submitGame = () => {
      setSuccess(false);
      setError(false);
      axios.post(URL_PREFIX + "/games/create", {
          title: title,
          activePlayers: [],
          eliminatedPlayers: [],
          startDate: startDate,
        //   endDate: endDate + ':00',
          immunities: immunities.length === 1 & immunities[0] === "" ? [] : immunities
      })
      .then((response) => {
          console.log(response);
          resetForm();
          try {
              sendNotification(response.data._id);
              setSuccess(true);
          } catch(err) {
              console.log(err);
          }
      })
      .catch((error) => {
          console.log(error.response);
          setError(true);
      });
  }

  function resetForm() {
    setTitle("");
    setStartDate("");
    setImmunities([""]);
  }

  async function sendNotification(id) {
      const params = {header: "Admin", message: "has created a new game", type: "new game", game: id};

      try {
          const response = await axios.patch(notifEndPoint, params);
          console.log(response);
      } catch (err) {
          console.log(err);
          if (err.response.data.message) {
              console.log(err.response.data.message);
          }
      }
  }

  const handleChangeInput = (i, e) => {
    //console.log(e.target.value);
    const values = [...immunities];
    values[i] = e.target.value;
    setImmunities(values);
  }
  
  
  const handleAdd = (id) => {
    setImmunities([...immunities, ""]);
  }
  
  const handleSubtract = (i) => {
    const values = [...immunities];
    values.splice(i, 1);
    setImmunities(values);
  }

  return (
      <div>
        <NavBar page="create"/>
        
        {success ?
            <div className="row">
                <div className="col-3 m-auto">
                    <div className="alert alert-success mt-3 mb-2" role="alert">
                        Game was successfully created!
                    </div>
                </div>
            </div>
        :
            <div></div>
        }   

        {error ?
            <div className="row">
                <div className="col-3 m-auto">
                    <div className="alert alert-danger mt-3 mb-2" role="alert">
                        An error occurred
                    </div>
                </div>
            </div>
        :
            <div></div>
        } 

        <div style={{width: "50%", margin: "auto"}}>
            <h1 style={{textAlign: "center", paddingLeft:"20px", paddingRight: "20px", color:"rgb(239, 229, 189)"}}>Create a new game:</h1>

            <div className="col-5" style={{ color:"rgb(239, 229, 189)", margin: "auto"}}>
                <label>Game Title: </label>
                <input className="form-control" value={title}
                    type='text'
                    onChange={e => {
                        setTitle(e.target.value)
                    }}
                />
            </div>

            <div className="col-5" style={{ color:"rgb(239, 229, 189)", margin: "auto"}}>
                <label>Start Date: </label>
                <input
                    className="form-control"
                    value = {startDate}
                    type='datetime-local'
                    onChange={e => {
                        console.log(typeof(e.target.value))
                        console.log(e.target.value)
                        setStartDate(e.target.value)
                    }}
                />
            </div>
            <p></p>
            <h5 style={{textAlign: "center", paddingLeft:"20px", paddingRight: "20px", color:"rgb(239, 229, 189)"}}>You may add immunities below:</h5>
            {immunities.map((field, i) => (
            <div key={i} className="col-5" style={{ color:"rgb(239, 229, 189)", margin: "auto"}}>
                <label>Immunity {i+1}:</label>
                <input className="form-control" type="text" placeholder="Enter immunity" name="firstName" value={field} onChange={e => handleChangeInput(i, e)} style={{marginLeft:"3px"}}/>
                <button onClick={() => handleAdd(i)} className="btn btn-outline-success btn-sm" style={{marginLeft:"5px"}}>
                    Add
                </button>
                <button disabled={immunities.length===1} onClick={() => handleSubtract(i)} className="btn btn-outline-danger btn-sm" style={{marginLeft:"5px"}}>
                    Del
                </button>
            </div>
            ))}

            <p></p>
            <div style={{ margin:"auto", width: "fit-content"}}>
                <button className="btn btn-primary" onClick={submitGame} style={{backgroundColor:"rgb(239, 229, 189)", color:"black"}}>Create Game</button>
            </div>
        </div>
      </div>
  )
}

export default Create;
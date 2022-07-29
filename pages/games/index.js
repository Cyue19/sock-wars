import { useState, useEffect } from 'react'
import axios from "axios";
import Link from 'next/link';

import Pagination from "../components/Pagination";
import NavBar from "../components/NavBar";

const URL_PREFIX = process.env.NEXT_PUBLIC_REACT_APP_URL;
const endPoint = process.env.NEXT_PUBLIC_REACT_APP_URL + "/auth/verify";

function ListGames() {
    const [allGames, setGames] = useState([]);
    const [personalGames, setPersonalGames] = useState([]);
    const [user, setUser] = useState({})

    useEffect(() => {
        axios.get(URL_PREFIX + "/games").then((response) => {
            let games = []
            console.log(response.data)
            for(let i = 0; i < response.data.length; i++) {
                games.push(response.data[i])
                console.log(response.data[i]._id)
                console.log(typeof(response.data[i]._id))
            }
            setGames(games)
        });
        fetchPersonalGames();
        setUser(JSON.parse(localStorage.user))
    }, []);

    async function fetchPersonalGames() {
        try {
            const response = await axios.get(endPoint);
            setPersonalGames(response.data.gamesPlayed);
            console.log(response.data.gamesPlayed);
        } catch (err) {
            console.log(err.response);
        }
    }

    return (
        <div>
            <NavBar page="games" />
            <div className="mx-5 px-5">
                <h1 style={{textAlign: "center", paddingLeft:"20px", paddingRight: "20px", color:"rgb(239, 229, 189)"}}>Games:</h1>

                <div className="mx-5">
                    <ul className="nav nav-pills" style={{margin: "1% 3.2%"}} id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" style={{borderRadius: "0"}} id="all-tab" data-bs-toggle="tab" data-bs-target="#all-tab-pane" type="button" role="tab" aria-controls="all-tab-pane" aria-selected="true">All Games</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="personal-tab" style={{borderRadius: "0"}} data-bs-toggle="tab" data-bs-target="#personal-tab-pane" type="button" role="tab" aria-controls="personal-tab-pane" aria-selected="false">Personal</button>
                        </li>
                    </ul>
                    <div className="tab-content" style={{margin: "0% 4%", color: "white"}} id="myTabContent">
                        <div className="tab-pane fade show active" id="all-tab-pane" role="tabpanel" aria-labelledby="all-tab" tabindex="0">
                            {allGames.length > 0 && (
                                allGames.map((game, idx) => {
                                    return (
                                    <div>
                                        <div className="row mb-1" style={{backgroundColor: "#2A3B4B"}}>
                                            <div className="col pt-3">
                                                <Link href={`/games/${encodeURIComponent(game._id)}`}>
                                                    <a style={{textDecoration: "none", color: "white", fontSize: "20px"}}>{game.title}</a>
                                                </Link> 
                                            </div>
                                            <div className="col">
                                                <div style={{position: "relative"}}>
                                                    <span className="text-center" style={{position: "absolute", width: "40px", paddingTop: "20px", color: "white"}}>1</span>
                                                    <i className="bi bi-star-fill me-2" style={{fontSize: "40px", color: "gold"}}></i>
                                                    <span style={{position: "absolute", top: "20px"}}>Player One</span>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="pt-1" style={{position: "relative"}}>
                                                    <span className="text-center" style={{position: "absolute", width: "34px", paddingTop: "15px", color: "white"}}>2</span>
                                                    <i className="bi bi-star-fill me-2" style={{fontSize: "35px", color: "gold"}}></i>
                                                    <span style={{position: "absolute", top: "20px"}}>Player Two</span>
                                                </div>
                                            </div>
                                            <div className="col pt-2" style={{position: "relative"}}>
                                                <div className="">
                                                    <span className="text-center" style={{position: "absolute", width: "30px", paddingTop: "12px", color: "white"}}>3</span>
                                                    <i className="bi bi-star-fill me-2" style={{fontSize: "30px", color: "gold"}}></i>
                                                    <span style={{position: "absolute", top: "20px"}}>Player Three</span>
                                                </div>
                                            </div>
                                            <div className="col pt-3 px-0">{new Date(game.startDate).toLocaleString()}</div>
                                            <div className="col-2 pt-3 text-center px-0">{game.status}</div>
                                        </div>
                                    </div>
                                    )
                                })
                            )}

                            
                        </div>
                        <div className="tab-pane fade" id="personal-tab-pane" role="tabpanel" aria-labelledby="personal-tab" tabindex="0">personal</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListGames
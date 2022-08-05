import styles from '../../styles/notifications.module.css';
import Link from "next/link";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../hooks/UserContext";

const confirmEndPoint = process.env.NEXT_PUBLIC_REACT_APP_URL + "/users/removeTarget";
const deleteEndPoint = process.env.NEXT_PUBLIC_REACT_APP_URL + "/notifications/delete";

export default function GeneralNotif(props) {

    const [show, setShow] = useState(true);

    const { user } = useContext(UserContext);

    function getIcon() {
        var icon = "bi bi-";

        switch(props.type) {
            case "immunity":
                icon += "bandaid";
                break;
            case "new game":
                icon += "joystick";
                break;
            case "target":
                icon += "person-circle";
                break;
            case "elimination":
                icon += "person-circle";
                break;
            default:
                break;
        }

        return icon;
    }

    async function confirmElimination() {
        try {
            // gameId, eliminatorUsername, eliminated, newTarget
            // var newTarget;
            // for (var i=0; i<user.gamesPlayed.length; i++) {
            //     if (user.gamesPlayed[i].gameId===props.gameId) {
            //         const targetList = user.gamesPlayed[i].targets
            //         newTarget = targetList[targetList.length-1];
            //         break;
            //     }
            // }

            const params = {
                gameId: props.gameId,
                eliminator: props.sender,
                eliminated: user,
                // newTarget: newTarget
            }

            const response = await axios.patch(confirmEndPoint, params);
            deleteNotification();
        } catch(err) {
            console.log(err.response);
        }
    }

    async function deleteNotification() {
        try {
            const response = await axios.patch(deleteEndPoint, {userName: user.userName, id: props.id});
            setShow(false);
            console.log(response);
        } catch(err) {
            console.log(err.response.data);
        }
    }

    return (
        <div>
            {show ?
                <div>
                    <li className="list-group-item" style={{background: "none", color: "white", border: "none"}}>
                        <div className="row">
                            <div className="col-1 me-5 me-md-4 me-lg-0 text-center">
                                <i className={getIcon()} style={{fontSize: "45px", color: "white"}}></i>
                            </div>
                            <div className="col">
                                <span style={{color: "goldenrod"}}>{props.header}</span> 
                                <button type="button" onClick={()=>deleteNotification()} style={{position: "absolute", top: "12px", right: "17px"}} className="btn-sm btn-close btn-close-white"></button>
                                <br/>
                                <span>{props.message}</span> <br/>
                                {props.type==="elimination" ?
                                    <div>
                                        <button className={styles.confirmBtn} onClick={()=>confirmElimination()}>Confirm</button>
                                        <button className={styles.denyBtn} onClick={()=>deleteNotification()}>Deny</button>
                                    </div>
                                :
                                    <div>
                                        <button className={styles.confirmBtn}>
                                            <Link href={"./games/" + props.gameId}>
                                                <a style={{textDecoration: "none", color: "white"}}>View</a>
                                            </Link>
                                        </button>
                                    </div>
                                }
                                <span className={styles.timeStamp}>{props.time}</span>
                            </div>
                        </div>
                    </li>
                    <hr className="m-0" style={{color: "lightgrey"}}></hr>
                </div>
                :
                <div></div>
            }
        </div>
    );
}
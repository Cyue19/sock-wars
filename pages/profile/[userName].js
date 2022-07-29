import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

import NavBar from "../components/NavBar";

const endPoint = process.env.NEXT_PUBLIC_REACT_APP_URL + "/users/";

export default function Profile() {
  const [profile, setProfile] = useState();
  const router = useRouter();
  const { userName } = router.query;

  useEffect(() => {
    try {
      fetchProfile();
    } catch (err) {
      console.log(err);
    }
  }, [userName]);

  async function fetchProfile() {
    try {
      const response = await axios.get(endPoint + userName);
      switch (response.data.year) {
        case "first":
          response.data.year = "1st";
          break;
        case "second":
          response.data.year = "2nd";
          break;
        case "third":
          response.data.year = "3rd";
          break;
        case "fourth":
          response.data.year = "4th";
          break;
        case "other":
          response.data.year = "Other";
          break;
        default:
          break;
      }
      setProfile(response.data);
    } catch (err) {
      console.log(err);
      // console.log(err.response.data.message);
    }
  }

  return (
    <div>
      {profile ? (
        <div>
          <NavBar page="profile"/>
          <div
            class="container d-flex justify-content-center align-items-center"
            style={{ paddingTop: "25px" }}
          >
            <div class="card" style={{ backgroundColor: "rgb(239, 229, 189)" }}>
              {/* <div class="upper">
                <img src="https://i.imgur.com/Qtrsrk5.jpg" class="img-fluid" />
              </div> */}
              <div class="user text-center">
                <div class="profile" style={{ paddingTop: "10px" }}>
                  <img
                    src="https://bootdey.com/img/Content/avatar/avatar7.png"
                    class="rounded-circle"
                    width="80"
                  />
                </div>
              </div>
              <div class="mt-5 text-center">
                <h4 class="mb-0">
                  {profile.firstName} {profile.lastName}
                </h4>
                <span class="text-muted d-block mb-2">{profile.year} Year</span>
                <button class="btn btn-primary btn-sm follow">
                  Edit Profile
                </button>
                <div class="d-flex justify-content-between align-items-center mt-4 px-4">
                  <div class="stats">
                    <h6 class="mb-0">Games Played</h6>
                    <span>{profile.statistics.gamesPlayed}</span>
                  </div>
                  <div class="stats">
                    <h6 class="mb-0">Games Won</h6>
                    <span>{profile.statistics.gamesWon}</span>
                  </div>
                  <div class="stats">
                    <h6 class="mb-0">Eliminations</h6>
                    <span>{profile.statistics.eliminations}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}

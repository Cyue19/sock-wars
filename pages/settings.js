//f1c40f - yellow
import { useState, useEffect } from "react";
import DetailsTab from "./components/DetailsTab";
import NotificationsTab from "./components/NotificationsTab";
import PasswordTab from "./components/PasswordTab";

import axios from "axios";
const endPoint = process.env.NEXT_PUBLIC_REACT_APP_URL + "/users/accountInfo";

export default function Settings() {
  const [userInfo, setUserInfo] = useState(null);

  async function fetchAccountInfo() {
    // const config = {
    //     headers:{
    //         authorization: window.localStorage.getItem("token")
    //     }
    // };

    try {
      const response = await axios.get(endPoint);
      setUserInfo(response.data);
      console.log(response.data);
      console.log(userInfo);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    try {
      fetchAccountInfo();
    } catch (err) {
      console.log(err.response.data.message);
    }
  }, []);

  // Handle the input change and save it in a variable
  const handleOnChange = (e) => {
    e.persist();

    setUserInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  async function updateAccountInfo() {
    // const config = {
    //     headers:{
    //         authorization: window.localStorage.getItem("token")
    //     }
    // };

    try {
      const response = await axios.patch(endPoint, {
        userInfo,
      });
      setUserInfo(response.data);
      console.log(response.data);
      console.log(userInfo);
    } catch (err) {
      console.log(err.response.data.message);
    }
  }

  return (
    <div class="container p-5">
      {!userInfo ? (
        <div> Loading </div>
      ) : (
        <div
          class="p-3 pb-5"
          style={{ borderRadius: "10px", backgroundColor: "#2A3B4B" }}
        >
          <h2 class="px-3 mb-1" style={{ color: "white" }}>
            Settings
          </h2>
          <hr className="mt-0" style={{ color: "white" }}></hr>

          <div className="row px-4">
            {/* Side Tabs */}
            <div
              className="col-md-2 nav flex-column nav-pills"
              id="pills-tab"
              role="tablist"
              aria-orientation="vertical"
            >
              <button
                class="nav-link active"
                id="account-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-account"
                type="button"
                role="tab"
                aria-controls="pills-account"
                aria-selected="true"
              >
                Account Details
              </button>
              <button
                class="nav-link"
                id="profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
              >
                Password
              </button>
              <button
                class="nav-link"
                id="messages-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-messages"
                type="button"
                role="tab"
                aria-controls="pills-messages"
                aria-selected="false"
              >
                Notifications
              </button>
            </div>

            {/* Tab Content */}
            <div
              style={{ backgroundColor: "", color: "white" }}
              class="col-md-10 tab-content"
              id="pills-tabContent"
            >
              {/* Account Details Tab */}

              <DetailsTab
                userInfo={userInfo}
                updateAccountInfo={updateAccountInfo}
                handleOnChange={handleOnChange}
              />

              {/* Password Tab */}
              <PasswordTab />

              {/* Notifications Tab */}

              <NotificationsTab />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
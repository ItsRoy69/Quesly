import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { UserContext } from "../App";
import "../Styles/Logout.css";

function Logout() {
  const [show, setShow] = useState(false);

  const history = useHistory();

  const logOut = async () => {
    try {
      setShow(true);
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("user_info");
      sessionStorage.removeItem("user_info");
      // alert("Successfully Logged Out!")
      const timer = setTimeout(() => {
        // window.open("/login", "_self");
        window.open("/", "_self");
      }, 2000);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    logOut();
  }, []);

  return (
    <>
      {show ? (
        <div class="wrapper">
          {" "}
          <svg class="animated-check" viewBox="0 0 24 24">
            <path d="M4.1 12.7L9 17.6 20.3 6.3" fill="none" />{" "}
          </svg>
          <h2>Logged Out Successfully!</h2>
        </div>
      ) : null}
    </>
  );
}

export default Logout;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import "../Styles/Spaces.css";
import bg from "../Images/illustration.png";
import Button from "@mui/material/Button";
import Loading from "../Components/Loading";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import userImg from "../Images/bg1.jpg";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";

function Spaces() {
  const [callApi, setCallApi] = useState(false);
  // const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [spaceName, setSpaceName] = useState("Yet Another Space");

  const location = useLocation();

  let user, username;

  if (location.state.LoggedUser) {
    user = location.state.LoggedUser;
    username = location.state.LoggedUser.username;
  } else {
    user = location.state.loggedInUser;
    username = location.state.loggedInUser.username;
  }

  const addMembers = (index) => {
    console.log("I am Add");
    console.log(index);

    if (members.includes(username)) {
      setMembers((preValue) => {
        return [...preValue, index];
      });
    } else {
      setMembers((preValue) => {
        return [...preValue, username, index];
      });
    }
  };

  const deleteMembers = (index) => {
    console.log("I am Delete");

    setMembers((preValue) => {
      return preValue.filter((arr) => {
        return index !== arr;
      });
    });
  };

  const memberStatus = (followingUser, index) => {
    console.log(index);
    const memberFound = members.find((elem) => {
      return elem === index;
    });

    if (!memberFound) {
      return (
        <FaPlus
          className="add-icon"
          style={{ cursor: "pointer" }}
          value={followingUser.username}
          name="members"
          color="primary"
          onClick={() => addMembers(index)}
        />
      );
    } else {
      return (
        <FaTrashAlt
          className="delete-icon"
          style={{ cursor: "pointer" }}
          value={followingUser.username}
          name="members"
          color="primary"
          onClick={() => deleteMembers(index)}
        />
      );
    }
  };

  const submitData = async () => {
    const admin = username;
    const data = { spaceName, admin, members };
    console.log(data);
    if (members.length >= 2) {
      await axios
        .post("https://quesly-backend.herokuapp.com/create-space", data, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          console.log(response);
          alert("Space Created Successfully!");
          history.push({
            pathname: "/my-spaces",
            state: { LogUser: user },
          });
          setSpaceName("Yet Another Space");
          setMembers([]);
        })
        .catch((e) => {
          console.log(e);
          alert("Space could not be created!");
        });
    } else {
      alert("You must select atleast 1 member!");
    }
  };

  const getSpaces = async () => {
    const data = user;
    await axios
      .post("https://quesly-backend.herokuapp.com/get-users-spaces", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response);
        setLoading(false);
        if (response.data.length > 0 && !location.state.loggedInUser) {
          history.push({
            pathname: "/my-spaces",
            state: { LogUser: data },
          });
        }
      })
      .catch((e) => {
        console.log(e);
        alert("Space could not be fetched!");
      });
  };

  useEffect(() => {
    getSpaces();
  }, [callApi]);

  const history = useHistory();

  if (sessionStorage.getItem("token")) {
    var token = sessionStorage.getItem("token");
  } else {
    token = localStorage.getItem("token");
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {token ? (
        <>
          <Navbar activeStatus="spaces" />
          <div
            id="fluidWrapper"
            style={{
              minHeight: "80vh",
              maxHeight: "max-content",
              padding: "0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            class="container-fluid"
          >
            <img
              className="background-spaces"
              src={bg}
              width="50%"
              style={{ objectFit: "contain" }}
            />
            <Button
              style={{ background: "#74b9ff", outline: "none" }}
              variant="contained"
              data-toggle="modal"
              data-target="#spaceModalCenter"
              className="background-spaces"
            >
              Create Your Space
              {/* <i style={{marginLeft: "0.5rem",fontSize:"1.05rem"}} class="fa fa-plus" aria-hidden="true"></i> */}
            </Button>
          </div>

          <div
            class="modal fade"
            id="spaceModalCenter"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLongTitle">
                    Create Your Space
                  </h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    style={{ outline: "none" }}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <form method="POST" style={{ marginBottom: "2rem" }}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="spaceName"
                      label="Enter Space Name"
                      name="spaceName"
                      autoComplete="off"
                      autoFocus
                      value={spaceName}
                      placeholder="Yet Another Space"
                      style={{ marginBottom: "1rem" }}
                      onChange={(e) => {
                        setSpaceName(e.target.value);
                      }}
                    />
                    <div class="dropdown-divider"></div>

                    <h5 style={{ marginBottom: "1rem" }}>Add Members</h5>

                    <div class="dropdown-divider"></div>

                    <div className="followed-users">
                      <h5 style={{ marginBottom: "1rem" }}>
                        People You Follow :
                      </h5>

                      {user.following.map((followingUser, index) => {
                        return (
                          <>
                            <div
                              key={followingUser._id}
                              className="users"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                id="user_img_container"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <img
                                  id="user_img"
                                  src={followingUser.profilePic}
                                />
                                <h5
                                  style={{
                                    marginBottom: "0",
                                    paddingLeft: "1rem",
                                  }}
                                >
                                  {followingUser.username}
                                </h5>
                              </div>

                              {memberStatus(
                                followingUser,
                                followingUser.username
                              )}
                            </div>
                            <div class="dropdown-divider"></div>
                          </>
                        );
                      })}
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    data-dismiss="modal"
                    onClick={submitData}
                  >
                    Create Space
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        history.push("/")
      )}
    </>
  );
}

export default Spaces;

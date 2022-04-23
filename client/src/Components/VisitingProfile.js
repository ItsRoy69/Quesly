import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import bg from "../Images/bg1.jpg";
import { useLocation } from "react-router-dom";
import "../Styles/Profile.css";
import { Link } from "react-router-dom";
import Loading from "../Components/Loading";

function VisitingProfile() {
  const location = useLocation();

  const [user, setUser] = useState("");
  const [visitingUser, setVisitingUser] = useState("");
  const [userQueries, setUserQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [callApi, setCallApi] = useState(false);

  const getVisitingUser = async () => {
    const data = location.state.visitingUser;
    await axios
      .post("https://quesly-backend.herokuapp.com/get-visiting-user", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setVisitingUser(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getUser = async () => {
    await axios
      .get("https://quesly-backend.herokuapp.com/getUser")
      .then((response) => {
        setUser(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getUserQueries = async () => {
    const data = {
      username: visitingUser.username,
    };
    await axios
      .post("https://quesly-backend.herokuapp.com/getQueries-by-user", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setUserQueries(response.data);
        setCallApi(!callApi);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //   if(userQueries){
  //     const totalUpvotes = userQueries.reduce((elem,accum) => {
  //         return accum += elem.upvotes.length;
  //     })
  //     console.log(totalUpvotes);
  //   }

  const followUser = async (user, follow_user) => {
    const data = { user, follow_user };
    await axios
      .post("https://quesly-backend.herokuapp.com/follow-user", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response);
        setCallApi(!callApi);

      })
      .catch((e) => {
        alert("Could Not Follow User!");
      });
  };

  const unfollowUser = async (user, unfollow_user) => {
    const data = { user, unfollow_user };
    await axios
      .post("https://quesly-backend.herokuapp.com/unfollow-user", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response);
        setCallApi(!callApi);

      })
      .catch((e) => {
        alert("Could Not unfollow User!");
      });
  };

  const followStat = (user, username) => {
    console.log(user.following);
    if (user.following) {
      const Followed = user.following.find((followedUser) => {
        return followedUser.username === username;
      });
      console.log(Followed);
      if (user.username === username) {
        return null;
      } else {
        if (Followed === undefined) {
          return (
            <p
              onClick={() => followUser(user.username, username)}
              style={{
                margin: "0",
                fontWeight: "bold",
                cursor: "pointer",
                color: "#2c3e50",
              }}
            >
              Follow
            </p>
          );
        } else {
          return (
            <p
              onClick={() => unfollowUser(user.username, username)}
              style={{
                margin: "0",
                fontWeight: "bold",
                cursor: "pointer",
                color: "#2c3e50",
              }}
            >
              Following
            </p>
          );
        }
      }
    }
  };

  useEffect(() => {
    getUser();
    getVisitingUser();
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
          <Navbar />

          {visitingUser ? (
            <>
              <div
                style={{
                  background: "#f1f2f2",
                  minHeight: "100vh",
                  maxHeight: "max-content",
                }}
                class="container-fluid"
              >
                <div className="container emp-profile  p-5">
                  <form method="">
                    <div className="row">
                      <div className="col-md-4">
                      <img
                        src={visitingUser.profilePic}
                        style={{
                          borderRadius: "50%",
                          width: "8rem",
                          height: "8rem",
                          objectFit: "cover",
                        }}
                        width="50%"
                        className="m-3"
                      />
                      </div>
                      <div className="col-md-6">
                        <div className="profile-head">
                          <h5>
                            {visitingUser.firstname} {visitingUser.lastname}
                          </h5>

                          {followStat(user, visitingUser.username)}

                          <p className="profile-rating mt-3 mb-5">
                            Web Developer
                          </p>
                          <section id="tabs" className="project-tab">
                            <ul className="nav nav-tabs" role="tablist">
                              <li className="nav-item">
                                <a
                                  className="nav-link active"
                                  id="home-tab"
                                  data-toggle="tab"
                                  href="#home"
                                  role="tab"
                                >
                                  About
                                </a>
                              </li>
                              <li className="nav-item">
                                {/* <a onClick={getUserQueries} className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab">Timeline</a> */}
                              </li>
                            </ul>
                          </section>
                        </div>
                      </div>

                      {/* <div className="col-md-2">
                            <input type="submit" className="profile-edit-btn" name="btnAddMore" value="Edit Profile"></input>
                        </div> */}
                    </div>

                    <div className="row">
                      <div className="col-md-4">
                        <div className="profile-work">
                          <p style={{ fontWeight: "bold" }}>
                            Selected Categories
                          </p>
                          {visitingUser.category.map((elem) => {
                            return (
                              <>
                                <Link
                                  style={{ textTransform: "capitalize" }}
                                  to={"/" + elem}
                                  target="_sayak"
                                >
                                  {elem}
                                </Link>{" "}
                                <br />
                              </>
                            );
                          })}
                        </div>
                      </div>
                      <div className="col-md-8 pl-5 about-info">
                        <div
                          className="tab-content profile-tab"
                          id="myTabContent"
                        >
                          <div
                            className="tab-pane fade show active"
                            id="home"
                            role="tabpanel"
                            aria-labelledby="home-tab"
                          >
                            <div className="row">
                              <div className="col-md-6">
                                <label style={{ fontWeight: "bold" }}>
                                  Username
                                </label>
                              </div>
                              <div className="col-md-6">
                                <label>{visitingUser.username}</label>
                              </div>
                            </div>

                            <div className="row mt-3">
                              <div className="col-md-6">
                                <label style={{ fontWeight: "bold" }}>
                                  Name
                                </label>
                              </div>
                              <div className="col-md-6">
                                <label>
                                  {visitingUser.firstname}{" "}
                                  {visitingUser.lastname}
                                </label>
                              </div>
                            </div>

                            {/* <div className="row mt-3">
                                            <div className="col-md-6">
                                                <label style={{fontWeight:"bold"}}>Email</label>
                                            </div>  
                                            <div className="col-md-6">
                                                <label>{visitingUser.email}</label>
                                            </div>  
                                        </div> */}

                            <div className="row mt-3">
                              <div className="col-md-6">
                                <label style={{ fontWeight: "bold" }}>
                                  Followers
                                </label>
                              </div>
                              <div className="col-md-6">
                                <label style={{ cursor: "pointer" }}>
                                  {visitingUser.followers.length}
                                </label>
                              </div>
                            </div>

                            <div className="row mt-3">
                              <div className="col-md-6">
                                <label style={{ fontWeight: "bold" }}>
                                  Following
                                </label>
                              </div>
                              <div className="col-md-6">
                                <label style={{ cursor: "pointer" }}>
                                  {visitingUser.following.length}
                                </label>
                              </div>
                            </div>
                          </div>

                          <div
                            className="tab-pane fade"
                            id="profile"
                            role="tabpanel"
                            aria-labelledby="profile-tab"
                          >
                            <div className="row">
                              <div className="col-md-6">
                                <label>Questions Posted</label>
                              </div>
                              <div className="col-md-6">
                                <label>{userQueries.length}</label>
                              </div>
                            </div>

                            <div className="row mt-3">
                              <div className="col-md-6">
                                <label>Question Upvotes</label>
                              </div>
                              <div className="col-md-6">
                                <label>35$/hr</label>
                              </div>
                            </div>

                            <div className="row mt-3">
                              <div className="col-md-6">
                                <label>Answers Posted</label>
                              </div>
                              <div className="col-md-6">
                                <label>100</label>
                              </div>
                            </div>

                            <div className="row mt-3">
                              <div className="col-md-6">
                                <label>English Level</label>
                              </div>
                              <div className="col-md-6">
                                <label>Fluent</label>
                              </div>
                            </div>

                            <div className="row mt-3">
                              <div className="col-md-6">
                                <label>Availability</label>
                              </div>
                              <div className="col-md-6">
                                <label>6 months</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </>
          ) : null}
        </>
      ) : (
        history.push("/")
      )}
    </>
  );
}

export default VisitingProfile;

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import bg from "../Images/bg1.jpg";
import "../Styles/Profile.css";
import { Link } from "react-router-dom";
import Loading from "../Components/Loading";
import avatar1 from "../Images/avatar1.png";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import bcrypt from 'bcryptjs';

function Profile() {
  const User =
    JSON.parse(localStorage.getItem("user_info")) ||
    JSON.parse(sessionStorage.getItem("user_info"));

  const username = User.username;

  const storage = getStorage();

  const [user, setUser] = useState("");
  const [userQueries, setUserQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [callApi, setCallApi] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [editUser, setEditUser] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    username: user.username,
  });
  const [editPassword, setEditPassword] = useState({
    currentPassword: "",
    password: "",
    cpassword: "",
  });
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [profileImg, setProfileImg] = useState(null);
  const [url, setUrl] = useState("");
  const [loader, setLoader] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [usernameValidation, setUsernameValidation] = useState({
    message: "",
    color: "",
  });
  const [passwordValidation, setPasswordValidation] = useState({
    message: "",
    color: "",
  });

  const getUser = async () => {
    await axios
      .post("https://quesly-backend.herokuapp.com/getUser", {
        username: username,
      })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
        console.log(response.data.following);
        // setQuery({ ...query, username: user.username });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getUserQueries = async () => {
    const data = {
      username: user.username,
    };
    await axios
      .post("https://quesly-backend.herokuapp.com/getQueries-by-user", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setUserQueries(response.data);
        setCallApi(!callApi);
        console.log(response.data);
        // setQuery({ ...query, username: user.username });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleProfileChange = (e) => {
    if (e.target.files[0]) {
      setProfileImg(e.target.files[0]);
    }
  };

  let name, value, filteredSearch;

  const handleEditProfile = async (e) => {
    name = e.target.name;
    value = e.target.value;

    setEditUser({ ...editUser, [name]: value });

    console.log(editUser.username);

    let username;

    if(name == "username"){
      username = value;
    }

    if (editUser.username) {
      await axios
        .post("https://quesly-backend.herokuapp.com/search-user", {
          search: username,
        })
        .then((res) => {
          console.log(res);
          setSearchResults(res.data);
          filteredSearch = searchResults.filter((user) => {
            return user !== null;
          });
          console.log(filteredSearch);
          if (filteredSearch && filteredSearch.length === 0) {
            setUsernameValidation({
              ...usernameValidation,
              message: "Username available",
              color: "green",
            });
          } else {
            setUsernameValidation({
              ...usernameValidation,
              message: "Username not available",
              color: "red",
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  let passName, passValue;
  let password, cpassword;

  const passwordHandler = (e) => {
    passName = e.target.name;
    passValue = e.target.value;

    setEditPassword({ ...editPassword, [passName]: passValue });

    if (passName == "password") {
      password = passValue;
      cpassword = editPassword.cpassword;
    }
    if (passName == "cpassword") {
      password = editPassword.password;
      cpassword = passValue;
    }

    console.log(password);
    console.log(cpassword);

    if (password !== cpassword) {
      setPasswordValidation({
        ...passwordValidation,
        message: "Passwords Not Matching",
        color: "red",
      });
    } else {
      setPasswordValidation({});
    }
  };

  const submitProfileChanges = async () => {
    await axios
      .patch(
        `https://quesly-backend.herokuapp.com/updateUser/${user._id}`,
        editUser
      )
      .then((response) => {
        alert("Profile Updated, You are going to be Logged Out.");
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        localStorage.removeItem("user_info");
        sessionStorage.removeItem("user_info");
        console.log(response);
        window.open("/", "_self");
      })
      .catch((e) => {
        alert("Could Not Update Profile");
        console.log(e);
      });
  };

  const changePassword = async () => {

    const credCheck = await bcrypt.compare(editPassword.currentPassword, user.password);

    console.log(credCheck);

    if(credCheck){ 
    await axios.patch(
      `https://quesly-backend.herokuapp.com/updateUser/${user._id}`,
      {
        password: await bcrypt.hash(editPassword.password,10),
        cpassword: await bcrypt.hash(editPassword.cpassword,10),
      })
      .then((response) => {
        alert("Password Updated, You are going to be Logged Out.");
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        localStorage.removeItem("user_info");
        sessionStorage.removeItem("user_info");
        console.log(response);
        window.open("/", "_self");
      })
      .catch((e) => {
        alert("Could Not Update Password");
        console.log(e);
      })
    }else{
      alert("Wrong Current Password")
    }
  };

  const handleProfileUpload = () => {
    const storageRef = ref(storage, `profileImages/${profileImg.name}`);
    setLoader(true);
    uploadBytes(storageRef, profileImg).then((snapshot) => {
      if (snapshot) {
        console.log(snapshot);
        setLoader(false);
        alert("Profile Picture Changed Successfully!");
        getDownloadURL(ref(storage, `profileImages/${profileImg.name}`)).then(
          (url) => {
            axios
              .patch(
                `https://quesly-backend.herokuapp.com/updateUser/${user._id}`,
                {
                  profilePic: url,
                }
              )
              .then((res) => {
                console.log(res);
                window.open("/", "_self");
              })
              .catch((e) => {
                console.log(`Could not save image Url. ${e}`);
              });
          }
        );
      }
    });
  };

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
          <Navbar activeStatus="profile" />

          {user ? (
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
                  <div className="row">
                    <div className="col-md-4">
                      <img
                        src={user.profilePic}
                        style={{
                          borderRadius: "50%",
                          width: "8rem",
                          height: "8rem",
                          objectFit: "cover",
                        }}
                        width="50%"
                        className="m-3"
                      />
                      <span onClick={() => setProfileModal(true)}>
                        <i
                          id="editProfilePic"
                          style={{
                            fontSize: "1.6rem",
                            position: "relative",
                            bottom: "-3.25rem",
                          }}
                          class="fa fa-pencil-square-o"
                          aria-hidden="true"
                        ></i>
                      </span>
                    </div>

                    {profileModal ? (
                      <div className="profileModal">
                        <div className="profileTitle">
                          <h4>Upload Profile Picture</h4>
                          <i
                            class="fa fa-times"
                            aria-hidden="true"
                            style={{
                              fontSize: "1.55rem",
                              color: "#808080",
                              cursor: "pointer",
                            }}
                            onClick={() => setProfileModal(false)}
                          ></i>
                        </div>
                        <hr style={{ width: "100%" }}></hr>

                        <div className="profileUpload">
                          <input type="file" onChange={handleProfileChange} />
                          {loader ? <div class="loader"></div> : null}
                        </div>

                        <div className="submitProfile">
                          <button
                            className="btn btn-primary"
                            style={{ width: "8rem" }}
                            onClick={handleProfileUpload}
                          >
                            Upload
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {editProfileModal ? (
                      <div className="editProfileModal">
                        <div className="profileTitle">
                          <h4>Edit Profile</h4>
                          <i
                            class="fa fa-times"
                            aria-hidden="true"
                            style={{
                              fontSize: "1.55rem",
                              color: "#808080",
                              cursor: "pointer",
                            }}
                            onClick={() => setEditProfileModal(false)}
                          ></i>
                        </div>
                        <hr style={{ width: "100%" }}></hr>
                        <div>
                          <div
                            className="row"
                            style={{ margin: "0", padding: "1.5rem" }}
                          >
                            <div
                              className="col-md-6"
                              id="editProfileLabels"
                              style={{
                                paddingLeft: "2.4rem",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <label for="firstname">First Name</label>
                              <label for="lastname">Last Name</label>
                              <label for="email">Email Address</label>
                              <label for="username">Username</label>
                            </div>

                            <div
                              className="col-md-6"
                              id="editProfileInputs"
                              style={{ paddingRight: "2.4rem", height: "100%" }}
                            >
                              <input
                                name="firstname"
                                value={editUser.firstname}
                                type="text"
                                onChange={handleEditProfile}
                              />
                              <input
                                name="lastname"
                                value={editUser.lastname}
                                type="text"
                                onChange={handleEditProfile}
                              />
                              <input
                                name="email"
                                value={editUser.email}
                                type="text"
                                onChange={handleEditProfile}
                              />
                              <input
                                name="username"
                                value={editUser.username}
                                type="text"
                                onChange={handleEditProfile}
                              />

                              {editUser.username ? (
                                <p
                                  className="animate__animated animate__headShake"
                                  style={{ color: usernameValidation.color }}
                                >
                                  {usernameValidation.message}
                                </p>
                              ) : null}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "end",
                                width: "100%",
                                marginTop: "1.2rem",
                              }}
                            >
                              {editUser.firstname ||
                              editUser.lastname ||
                              editUser.email ||
                              editUser.username ? (
                                <button
                                  className="btn btn-primary"
                                  style={{
                                    width: "12rem",
                                    marginRight: "0.25rem",
                                  }}
                                  onClick={submitProfileChanges}
                                >
                                  Save Profile Changes
                                </button>
                              ) : (
                                <button
                                  className="btn btn-primary"
                                  style={{
                                    width: "12rem",
                                    marginRight: "0.25rem",
                                  }}
                                  disabled={true}
                                >
                                  Save Profile Changes
                                </button>
                              )}
                            </div>
                          </div>

                          <hr style={{ width: "100%" }}></hr>
                          <div className="profileTitle">
                            <h4>Change Your Password</h4>
                          </div>

                          <div
                            className="row"
                            style={{ margin: "0", padding: "2rem" }}
                          >
                            <div
                              className="col-md-6"
                              id="editProfileLabels"
                              style={{
                                paddingLeft: "2.4rem",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <label for="currentPassword">
                                Current Password
                              </label>
                              <label for="password">New Password</label>
                              <label for="cpassword">
                                Confirm New Password
                              </label>
                            </div>

                            <div
                              className="col-md-6"
                              id="editProfileInputs"
                              style={{ paddingRight: "2.4rem", height: "100%" }}
                            >
                              <input
                                name="currentPassword"
                                type="password"
                                required
                                onChange={passwordHandler}
                              />
                              <input
                                name="password"
                                type="password"
                                required
                                onChange={passwordHandler}
                              />
                              <input
                                name="cpassword"
                                type="password"
                                required
                                onChange={passwordHandler}
                              />

                              <p
                                className="animate__animated animate__headShake"
                                style={{ color: passwordValidation.color }}
                              >
                                {passwordValidation.message}
                              </p>
                            </div>
                          </div>
                        </div>

                        {editPassword.currentPassword && editPassword.password && editPassword.cpassword ?
                        <div className="submitProfile">
                          <button
                            className="btn btn-primary"
                            style={{ width: "10rem" }}
                            type="submit"
                            onClick={changePassword}
                          >
                            Change Password
                          </button>
                        </div>
                        :
                        <div className="submitProfile">
                          <button
                            className="btn btn-primary"
                            style={{ width: "10rem" }}
                            type="submit"
                            onClick={changePassword}
                            disabled={true}
                          >
                            Change Password
                          </button>
                        </div>
                        }
                      </div>
                    ) : null}

                    <div className="col-md-6">
                      <div className="profile-head">
                        <h5>
                          {user.firstname} {user.lastname}
                        </h5>
                        {/* <h6>Web Developer</h6> */}

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

                    <div className="col-md-2">
                      <button
                        id="editProfileBtn"
                        style={{
                          width: "7.8rem",
                          padding: "0.25rem",
                          cursor: "pointer",
                          borderRadius: "6px",
                          border: "2px solid #999999",
                        }}
                        onClick={() => setEditProfileModal(true)}
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4">
                      <div className="profile-work">
                        <p style={{ fontWeight: "bold" }}>
                          Selected Categories
                        </p>
                        {user.category.map((elem) => {
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
                              <label>{user.username}</label>
                            </div>
                          </div>

                          <div className="row mt-3">
                            <div className="col-md-6">
                              <label style={{ fontWeight: "bold" }}>Name</label>
                            </div>
                            <div className="col-md-6">
                              <label>
                                {user.firstname} {user.lastname}
                              </label>
                            </div>
                          </div>

                          <div className="row mt-3">
                            <div className="col-md-6">
                              <label style={{ fontWeight: "bold" }}>
                                Email
                              </label>
                            </div>
                            <div className="col-md-6">
                              <label>{user.email}</label>
                            </div>
                          </div>

                          <div className="row mt-3">
                            <div className="col-md-6">
                              <label style={{ fontWeight: "bold" }}>
                                Followers
                              </label>
                            </div>
                            <div className="col-md-6">
                              <label style={{ cursor: "pointer" }}>
                                {user.followers.length}
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
                                {user.following.length}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

export default Profile;

import React, { useState, useEffect } from "react";
import "../Styles/Registration.css";
import { Link } from "react-router-dom";
import brand1 from "../Images/brand1.png";
import axios from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useHistory } from "react-router-dom";

function Registration() {
  const [step, setStep] = useState(1);
  const [bg1, setBg1] = useState("linear-gradient(145deg, #e7cac3, #c2aaa4)");
  const [bx1, setBx1] = useState("1px 3px 1px #9E9E9E");
  const [bg2, setBg2] = useState("linear-gradient(145deg, #e7cac3, #c2aaa4)");
  const [bx2, setBx2] = useState("1px 3px 1px #9E9E9E");
  const [transform1, setTransform1] = useState("scale(1)");
  const [transform2, setTransform2] = useState("scale(1)");
  const [transition1, setTransition1] = useState(".3s");
  const [transition, setTransition2] = useState(".3s");
  const [texts1, setTexts1] = useState("none");
  const [texts2, setTexts2] = useState("none");
  const [clicked, setClicked] = useState(false);
  const [category, setCategory] = useState([]);

  const [profileModal, setProfileModal] = useState(false);
  const [coverModal, setCoverModal] = useState(false);
  const [profileImg, setProfileImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null);
  const [url, setUrl] = useState("");
  const [loader, setLoader] = useState(false);

  let styles;

  const handleProfileChange = (e) => {
    if (e.target.files[0]) {
      setProfileImg(e.target.files[0]);
    }
  };

  const storage = getStorage();

  const history = useHistory();

  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    cpassword: "",
    profilePic: "",
  });

  let name, value;

  const inputsHandler = (e) => {
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  let val;
  const categoryHandler = (e) => {
    console.log(e);
    if (!category.includes(e.target.value)) {
      setCategory([...category, e.target.value]);
    } else {
      setCategory((preValue) => {
        return preValue.filter((elem) => {
          return elem !== e.target.value;
        });
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...user,
        username: user.username.toLowerCase(),
        category: category,
        profilePic: url,
      };
      await axios
        .post("https://quesly-backend.herokuapp.com/register", data, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          alert("Registration Successfull!");
          history.push("/");
          console.log(response);
        })
        .catch((e) => {
          alert("Registration Unsuccessfull!");
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const handleProfileUpload = () => {
    const storageRef = ref(storage, `profileImages/${profileImg.name}`);
    setLoader(true);
    uploadBytes(storageRef, profileImg).then((snapshot) => {
      if (snapshot) {
        console.log(snapshot);
        setLoader(false);
        alert("Profile Picture Uploaded Successfully!");
        getDownloadURL(ref(storage, `profileImages/${profileImg.name}`)).then(
          (url) => {
            setUrl(url);
          }
        );
      }
    });
  };

  const FormFields = (props) => {
    switch (props.step) {
      case 1:
        {
          return (
            <div>
              <h1 id="label-text">What is your First Name?</h1>

              <input
                className="regfield"
                name="firstname"
                id="fname"
                type="text"
                placeholder="First Name"
                required
                autoFocus
                onChange={inputsHandler}
                value={user.firstname}
              />
            </div>
          );
        }
        break;
      case 2:
        {
          return (
            <div>
              <h1 id="label-text">May i have your Last Name?</h1>

              <input
                className="regfield"
                name="lastname"
                id="fname"
                type="text"
                placeholder="Last Name"
                required
                autoFocus
                onChange={inputsHandler}
                value={user.lastname}
              />
            </div>
          );
        }
        break;
      case 3:
        {
          return (
            <div>
              <h1 id="label-text">Mind dropping down your Email?</h1>
              <input
                className="regfield"
                name="email"
                id="fname"
                type="email"
                placeholder="abc123@gmail.com"
                required
                autoFocus
                onChange={inputsHandler}
                value={user.email}
              />
            </div>
          );
        }
        break;
      case 4:
        {
          return (
            <div>
              <h1 id="label-text">What should we call you?</h1>

              {/* <p style={{margin:"0"}}>(Minimum 5 letters)</p> */}
              <input
                className="regfield"
                name="username"
                id="fname"
                type="text"
                placeholder="Peter97"
                required
                autoFocus
                onChange={inputsHandler}
                value={user.username}
              />
            </div>
          );
        }
        break;
      case 5:
        {
          return (
            <div>
              <h1 id="label-text">Choose Your Interests</h1>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  marginTop: "7.2rem",
                }}
              >
                <div
                  id="check-wrap"
                  class="container-fluid"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  <input
                    id="category1"
                    name="health"
                    type="checkbox"
                    value="health"
                    onChange={categoryHandler}
                  ></input>
                  {category.includes("health") ? (
                    <div
                      id="cards1"
                      style={{
                        border: "2px solid #974b15",
                        boxShadow: "0px 0px 20px 2px rgba(195, 85, 21, 0.75)",
                        transition: "0.3s all",
                      }}
                    >
                      <label
                        id="category-text"
                        style={{ fontSize: "1.5rem" }}
                        for="category1"
                      >
                        Health & Fitness
                        <div
                          id="tickmark1"
                          style={{
                            display: "flex",
                            width: "100%",
                            textAlign: "center",
                            position: "absolute",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                            top: "-1.2rem",
                          }}
                        >
                          <span
                            id="circle1"
                            style={{
                              backgroundColor: "#974b15",
                              color: "white",
                              boxShadow:
                                "0px 0px 20px 2px rgba(195, 85, 21, 0.75)",
                              transition: ".3s all",
                            }}
                          >
                            <i class="fa fa-check" aria-hidden="true"></i>
                          </span>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div id="cards1">
                      <label
                        id="category-text"
                        style={{ fontSize: "1.5rem" }}
                        for="category1"
                      >
                        Health & Fitness
                      </label>
                    </div>
                  )}

                  <input
                    id="category2"
                    name="education"
                    type="checkbox"
                    value="education"
                    onChange={categoryHandler}
                  ></input>

                  {category.includes("education") ? (
                    <div
                      id="cards2"
                      style={{
                        border: "2px solid #974b15",
                        boxShadow: "0px 0px 20px 2px rgba(195, 85, 21, 0.75)",
                        transition: "0.3s all",
                      }}
                    >
                      <label
                        id="category-text"
                        style={{ fontSize: "1.5rem" }}
                        for="category2"
                      >
                        Education
                        <div
                          id="tickmark2"
                          style={{
                            display: "flex",
                            width: "100%",
                            textAlign: "center",
                            position: "absolute",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                            top: "-1.2rem",
                          }}
                        >
                          <span
                            id="circle2"
                            style={{
                              backgroundColor: "#974b15",
                              color: "white",
                              boxShadow:
                                "0px 0px 20px 2px rgba(195, 85, 21, 0.75)",
                              transition: ".3s all",
                            }}
                          >
                            <i class="fa fa-check" aria-hidden="true"></i>
                          </span>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div id="cards2">
                      <label
                        id="category-text"
                        style={{ fontSize: "1.5rem" }}
                        for="category2"
                      >
                        Education
                        <div id="tickmark2">
                          <span id="circle2">
                            <i class="fa fa-check" aria-hidden="true"></i>
                          </span>
                        </div>
                      </label>
                    </div>
                  )}

                  <input
                    id="category3"
                    name="lifestyle"
                    type="checkbox"
                    value="lifestyle"
                    onChange={categoryHandler}
                  ></input>

                  {category.includes("lifestyle") ? (
                    <div
                      id="cards3"
                      style={{
                        border: "2px solid #974b15",
                        boxShadow: "0px 0px 20px 2px rgba(195, 85, 21, 0.75)",
                        transition: "0.3s all",
                      }}
                    >
                      <label
                        id="category-text"
                        style={{ fontSize: "1.5rem" }}
                        for="category3"
                      >
                        Lifestyle
                        <div
                          id="tickmark3"
                          style={{
                            display: "flex",
                            width: "100%",
                            textAlign: "center",
                            position: "absolute",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                            top: "-1.2rem",
                          }}
                        >
                          <span
                            id="circle3"
                            style={{
                              backgroundColor: "#974b15",
                              color: "white",
                              boxShadow:
                                "0px 0px 20px 2px rgba(195, 85, 21, 0.75)",
                              transition: ".3s all",
                            }}
                          >
                            <i class="fa fa-check" aria-hidden="true"></i>
                          </span>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div id="cards3">
                      <label
                        id="category-text"
                        style={{ fontSize: "1.5rem" }}
                        for="category3"
                      >
                        Lifestyle
                        <div id="tickmark3">
                          <span id="circle3">
                            <i class="fa fa-check" aria-hidden="true"></i>
                          </span>
                        </div>
                      </label>
                    </div>
                  )}

                  <input
                    id="category4"
                    name="business"
                    type="checkbox"
                    value="business"
                    onChange={categoryHandler}
                  ></input>

                  {category.includes("business") ? (
                    <div
                      id="cards4"
                      style={{
                        border: "2px solid #974b15",
                        boxShadow: "0px 0px 20px 2px rgba(195, 85, 21, 0.75)",
                        transition: "0.3s all",
                      }}
                    >
                      <label
                        id="category-text"
                        style={{ fontSize: "1.5rem" }}
                        for="category4"
                      >
                        Business & Marketing
                        <div
                          id="tickmark4"
                          style={{
                            display: "flex",
                            width: "100%",
                            textAlign: "center",
                            position: "absolute",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                            top: "-1.2rem",
                          }}
                        >
                          <span
                            id="circle4"
                            style={{
                              backgroundColor: "#974b15",
                              color: "white",
                              boxShadow:
                                "0px 0px 20px 2px rgba(195, 85, 21, 0.75)",
                              transition: ".3s all",
                            }}
                          >
                            <i class="fa fa-check" aria-hidden="true"></i>
                          </span>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div id="cards4">
                      <label
                        id="category-text"
                        style={{ fontSize: "1.5rem" }}
                        for="category4"
                      >
                        Business & Marketing
                        <div id="tickmark4">
                          <span id="circle4">
                            <i class="fa fa-check" aria-hidden="true"></i>
                          </span>
                        </div>
                      </label>
                    </div>
                  )}

                  <input
                    id="category5"
                    name="category"
                    type="checkbox"
                    value="trending"
                    onChange={categoryHandler}
                  ></input>

                  {category.includes("trending") ? (
                    <div
                      id="cards5"
                      style={{
                        border: "2px solid #974b15",
                        boxShadow: "0px 0px 20px 2px rgba(195, 85, 21, 0.75)",
                        transition: "0.3s all",
                      }}
                    >
                      <label
                        id="category-text"
                        style={{ fontSize: "1.5rem" }}
                        for="category5"
                      >
                        Trending
                        <div
                          id="tickmark5"
                          style={{
                            display: "flex",
                            width: "100%",
                            textAlign: "center",
                            position: "absolute",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                            top: "-1.2rem",
                          }}
                        >
                          <span
                            id="circle5"
                            style={{
                              backgroundColor: "#974b15",
                              color: "white",
                              boxShadow:
                                "0px 0px 20px 2px rgba(195, 85, 21, 0.75)",
                              transition: ".3s all",
                            }}
                          >
                            <i class="fa fa-check" aria-hidden="true"></i>
                          </span>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div id="cards5">
                      <label
                        id="category-text"
                        style={{ fontSize: "1.5rem" }}
                        for="category5"
                      >
                        Trending
                        <div id="tickmark5">
                          <span id="circle5">
                            <i class="fa fa-check" aria-hidden="true"></i>
                          </span>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }
        break;
      case 6:
        {
          return (
            <div>
              <h1 id="label-text">Create your Password</h1>

              <input
                className="regfield"
                name="password"
                id="fname"
                type="password"
                placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                required
                autoFocus
                onChange={inputsHandler}
                value={user.password}
              />
            </div>
          );
        }
        break;
      case 7:
        {
          return (
            <div>
              <h1 id="label-text">Kindly confirm your Password</h1>

              <input
                className="regfield"
                name="cpassword"
                id="fname"
                type="password"
                placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                required
                autoFocus
                onChange={inputsHandler}
                value={user.cpassword}
              />
            </div>
          );
        }
        break;
      case 8: {
        return (
          <>
            <h1 id="label-text">Lastly, Upload Your Profile Picture</h1>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                marginTop: "7.2rem",
              }}
            >
              <button
                style={{
                  background:
                    "linear-gradient(145deg, rgb(231, 202, 195), rgb(194, 170, 164))",
                  boxShadow: "rgb(158, 158,158) 1px 3px 1px",
                  padding: "1rem",
                  outline: "none",
                  border: "none",
                  borderRadius: "8px",
                  color: "#974b15",
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                }}
                onClick={() => setProfileModal(true)}
              >
                Upload Profile Picture
              </button>

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
                    <input
                      type="file"
                      id="rgba"
                      onChange={handleProfileChange}
                    />
                    {profileImg ? <p>{profileImg.name}</p> : null}
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

              {/* <input
                type="file"
                onChange={handleProfileChange}
              ></input>
              {profileImg?
              <p>{profileImg.name}</p>
              : null
              } */}
              {/* <input
                id="profilePic1"
                name="profilePic"
                type="radio"
                value="https://i.ibb.co/tpXJJJZ/avatar1.png"
                onChange={inputsHandler}
              ></input>

              {user.profilePic === "https://i.ibb.co/tpXJJJZ/avatar1.png" ? (
                <div
                  id="cards1"
                  style={{
                    border: "2px solid #974b15",
                    boxShadow: "0px 0px 20px 2px rgba(195, 85, 21, 0.75)",
                    transition: "0.3s all",
                  }}
                >
                  <label
                    id="category-text"
                    style={{ fontSize: "1.5rem" }}
                    for="profilePic1"
                  >
                    <img
                      src={avatar1}
                      style={{ width: "10rem", borderRadius: "50%" }}
                    ></img>
                    <div id="tickmark1">
                      <span id="circle1">
                        <i class="fa fa-check" aria-hidden="true"></i>
                      </span>
                    </div>
                  </label>
                </div>
              ) : (
                <div id="cards1">
                  <label
                    id="category-text"
                    style={{ fontSize: "1.5rem" }}
                    for="profilePic1"
                  >
                    <img
                      src={avatar1}
                      style={{ width: "10rem", borderRadius: "50%" }}
                    ></img>
                    <div id="tickmark1">
                      <span id="circle1">
                        <i class="fa fa-check" aria-hidden="true"></i>
                      </span>
                    </div>
                  </label>
                </div>
              )}

              <input
                id="profilePic2"
                name="profilePic"
                type="radio"
                value="https://i.ibb.co/9bJpBS3/avatar2.png"
                onChange={inputsHandler}
              ></input>

              {user.profilePic === "https://i.ibb.co/9bJpBS3/avatar2.png" ? (
                <div
                  id="cards2"
                  style={{
                    border: "2px solid #974b15",
                    boxShadow: "0px 0px 20px 2px rgba(195, 85, 21, 0.75)",
                    transition: "0.3s all",
                  }}
                >
                  <label
                    id="category-text"
                    style={{ fontSize: "1.5rem" }}
                    for="profilePic2"
                  >
                    <img
                      src={avatar2}
                      style={{ width: "10rem", borderRadius: "50%" }}
                    ></img>
                    <div id="tickmark1">
                      <span id="circle1">
                        <i class="fa fa-check" aria-hidden="true"></i>
                      </span>
                    </div>
                  </label>
                </div>
              ) : (
                <div id="cards2">
                  <label
                    id="category-text"
                    style={{ fontSize: "1.5rem" }}
                    for="profilePic2"
                  >
                    <img
                      src={avatar2}
                      style={{ width: "10rem", borderRadius: "50%" }}
                    ></img>
                    <div id="tickmark1">
                      <span id="circle1">
                        <i class="fa fa-check" aria-hidden="true"></i>
                      </span>
                    </div>
                  </label>
                </div>
              )}

              <input
                id="profilePic3"
                name="profilePic"
                type="radio"
                value="https://i.ibb.co/2c9S004/avatar3.png"
                onChange={inputsHandler}
              ></input>

              {user.profilePic === "https://i.ibb.co/2c9S004/avatar3.png" ? (
                <div
                  id="cards3"
                  style={{
                    border: "2px solid #974b15",
                    boxShadow: "0px 0px 20px 2px rgba(195, 85, 21, 0.75)",
                    transition: "0.3s all",
                  }}
                >
                  <label
                    id="category-text"
                    style={{ fontSize: "1.5rem" }}
                    for="profilePic3"
                  >
                    <img
                      src={avatar3}
                      style={{ width: "10rem", borderRadius: "50%" }}
                    ></img>
                    <div id="tickmark1">
                      <span id="circle1">
                        <i class="fa fa-check" aria-hidden="true"></i>
                      </span>
                    </div>
                  </label>
                </div>
              ) : (
                <div id="cards3">
                  <label
                    id="category-text"
                    style={{ fontSize: "1.5rem" }}
                    for="profilePic3"
                  >
                    <img
                      src={avatar3}
                      style={{ width: "10rem", borderRadius: "50%" }}
                    ></img>
                    <div id="tickmark1">
                      <span id="circle1">
                        <i class="fa fa-check" aria-hidden="true"></i>
                      </span>
                    </div>
                  </label>
                </div>
              )}

              <input
                id="profilePic4"
                name="profilePic"
                type="radio"
                value="https://cloud-ex42.usaupload.com/file/5fsK/avatar4.png"
                onChange={inputsHandler}
              ></input>

              {user.profilePic ===
              "https://cloud-ex42.usaupload.com/file/5fsK/avatar4.png" ? (
                <div
                  id="cards4"
                  style={{
                    border: "2px solid #974b15",
                    boxShadow: "0px 0px 20px 2px rgba(195, 85, 21, 0.75)",
                    transition: "0.3s all",
                  }}
                >
                  <label
                    id="category-text"
                    style={{ fontSize: "1.5rem" }}
                    for="profilePic4"
                  >
                    <img
                      src={avatar4}
                      style={{ width: "10rem", borderRadius: "50%" }}
                    ></img>
                    <div id="tickmark1">
                      <span id="circle1">
                        <i class="fa fa-check" aria-hidden="true"></i>
                      </span>
                    </div>
                  </label>
                </div>
              ) : (
                <div id="cards4">
                  <label
                    id="category-text"
                    style={{ fontSize: "1.5rem" }}
                    for="profilePic4"
                  >
                    <img
                      src={avatar4}
                      style={{ width: "10rem", borderRadius: "50%" }}
                    ></img>
                    <div id="tickmark1">
                      <span id="circle1">
                        <i class="fa fa-check" aria-hidden="true"></i>
                      </span>
                    </div>
                  </label>
                </div>
              )} */}
            </div>
          </>
        );
      }
      default: {
        setStep(1);
        return (
          <>
            <h1 id="label-text">What is your First Name?</h1>

            <input
              className="regfield"
              id="fname"
              type="text"
              placeholder="First Name"
              required
              autoFocus
            />
          </>
        );
      }
    }
  };

  // const hoverEffect1 = () => {
  //   if (!clicked) {
  //     setBg1("linear-gradient(145deg, #c2aaa4, #e7cac3)");
  //     setBx1("inset 5px 5px 11px #c9b0a9,inset -5px -5px 11px #e7cac3");
  //     setTransform1("scale(1.15)");
  //     setTransition1(".3s");
  //     setTexts1("0px 0px 6px rgba(160, 80, 45, 1)");
  //   }
  // };

  // const hoverEffect2 = () => {
  //   if (!clicked) {
  //     setBg2("linear-gradient(145deg, #c2aaa4, #e7cac3)");
  //     setBx2("inset 5px 5px 11px #c9b0a9,inset -5px -5px 11px #e7cac3");
  //     setTransform2("scale(1.15)");
  //     setTransition2(".3s");
  //     setTexts2("0px 0px 6px rgba(160, 80, 45, 1)");
  //   }
  // };

  // const clickEffect = () => {
  //   setBg("red");
  // };

  return (
    <div>
      <div id="regWrapper" class="container-fluid">
        <div class="container" id="regContainer">
          <img
            style={{ position: "absolute", top: "1.25rem" }}
            src={brand1}
            width="200px"
          />
          <div className="regForm">
            <section id="slider">
              <FormFields step={step} />

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "4rem",
                  padding: "0",
                }}
                class="container"
              >
                <button
                  style={{
                    background: bg1,
                    boxShadow: bx1,
                    transform: transform1,
                    transition: transition1,
                    textShadow: texts1,
                  }}
                  // onMouseEnter={hoverEffect1}
                  onMouseLeave={() => {
                    if (!clicked) {
                      // setBx1("1px 3px 1px #9E9E9E");
                      // setBg1("linear-gradient(145deg, #e7cac3, #c2aaa4)");
                      // setTransform1("scale(1)");
                      // setTransition1(".3s");
                      // setTexts1("none");
                    }
                  }}
                  type="button"
                  className="prev"
                  onClick={() => {
                    setStep(step - 1);
                    setClicked(!clicked);
                    // setBx1(
                    //   "inset 5px 5px 9px #b59f99,inset -5px -5px 9px #fbdbd3"
                    // );
                    // setTransform1("scale(1)");
                    // setTexts1("0px 0px 6px rgba(160, 80, 45, 1)");
                  }}
                >
                  <i class="fa fa-chevron-left" aria-hidden="true"></i> Back{" "}
                </button>

                {step != 8 ? (
                  <button
                    style={{
                      background: bg2,
                      boxShadow: bx2,
                      transform: transform2,
                      transition: transition1,
                      textShadow: texts2,
                    }}
                    // onMouseEnter={hoverEffect2}
                    onMouseLeave={() => {
                      if (!clicked) {
                        // setBx2("1px 3px 1px #9E9E9E");
                        // setBg2("linear-gradient(145deg, #e7cac3, #c2aaa4)");
                        // setTransform2("scale(1)");
                        // setTransition2(".3s");
                        // setTexts2("none");
                      }
                    }}
                    type="button"
                    className="next"
                    onClick={() => {
                      setStep(step + 1);
                      setClicked(!clicked);
                      // setBx2(
                      //   "inset 5px 5px 9px #b59f99,inset -5px -5px 9px #fbdbd3"
                      // );
                      // setTransform2("scale(1)");
                      // setTexts2("0px 0px 6px rgba(160, 80, 45, 1)");
                    }}
                  >
                    Next <i class="fa fa-chevron-right" aria-hidden="true"></i>
                  </button>
                ) : null}

                {step === 8 ? (
                  <button
                    className="signUp"
                    type="submit"
                    onClick={submitHandler}
                  >
                    Sign Up
                  </button>
                ) : null}
              </div>
            </section>
          </div>
          <Link className="hyperlink" to="/">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Registration;

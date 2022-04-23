import React, { useEffect, useState } from "react";
import brand1 from "../Images/brand1.png";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import spinner from "../Images/spinner.gif";

function Navbar(props) {
  const [toggle, setToggle] = useState(false);
  const [user, setUser] = useState("");
  const [searchToggle, setSearchToggle] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const User =
    JSON.parse(localStorage.getItem("user_info")) ||
    JSON.parse(sessionStorage.getItem("user_info"));

  const username = User.username;



  const getUser = async () => {
    await axios
      .post("https://quesly-backend.herokuapp.com/getuser", {
        username: username,
      })
      .then((response) => {
        setUser(response.data);
        console.log(response.data.following);
        // setQuery({ ...query, username: user.username });
      })
      .catch((e) => {
        console.log(e);
      });
  };



  const inputsHandler = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  console.log(searchResults);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <div class="container">
        <div class="col">
          <nav class="navbar navbar-expand-lg navbar-light ">
            <Link class="navbar-brand" to="/">
              <img width="150px" src={brand1} />
            </Link>
            <button
              class="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav mr-auto">
                <li
                  class={`nav-item ${
                    props.activeStatus === "home" ? "active" : null
                  }`}
                >
                  <Link class="nav-link" to="/">
                    Home <span class="sr-only">(current)</span>
                  </Link>
                </li>
                <li
                  class={`nav-item ${
                    props.activeStatus === "profile" ? "active" : null
                  }`}
                >
                  <Link class="nav-link" to="/profile">
                    Profile{" "}
                  </Link>
                </li>
                <li class={`nav-item dropdown ${toggle ? "show" : ""}`}>
                  <a
                    onClick={() => setToggle(!toggle)}
                    class="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Categories
                  </a>
                  <div
                    class={`dropdown-menu ${toggle ? "show" : ""}`}
                    aria-labelledby="navbarDropdown"
                  >
                    <Link class="dropdown-item" to="/health">
                      Health & Fitness
                    </Link>
                    <div class="dropdown-divider"></div>
                    <Link class="dropdown-item" to="/business">
                      Business & Marketing
                    </Link>
                    <div class="dropdown-divider"></div>
                    <Link class="dropdown-item" to="/education">
                      Education
                    </Link>
                    <div class="dropdown-divider"></div>
                    <Link class="dropdown-item" to="/lifestyle">
                      Lifestyle
                    </Link>
                    <div class="dropdown-divider"></div>
                    <Link class="dropdown-item" to="/trending">
                      Trending
                    </Link>
                  </div>
                </li>
                <li
                  class={`nav-item ${
                    props.activeStatus === "spaces" ? "active" : null
                  }`}
                >
                  <Link
                    class="nav-link"
                    to={{ pathname: "/spaces", state: { LoggedUser: user } }}
                  >
                    Spaces
                  </Link>
                </li>
                <li
                  class={`nav-item ${
                    props.activeStatus === "contact" ? "active" : null
                  }`}
                >
                  <Link class="nav-link" to="/contact">
                    Contact Us
                  </Link>
                </li>

              </ul>
              <form class="form-inline my-2 my-lg-0">
                <input
                  onChange={inputsHandler}
                  class="form-control mr-sm-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={search}
                />
                {searchToggle ? (
                  <button
                    class="btn btn-outline-success my-2 my-sm-0"
                    onClick={async (e) => {
                      e.preventDefault();
                      const data = { search };
                      if (search) {
                        setSearchToggle(false);
                        await axios
                          .post("https://quesly-backend.herokuapp.com/search-user", data, {
                            headers: { "Content-Type": "application/json" },
                          })
                          .then((response) => {
                            console.log(response);
                            setSearchResults(response.data);
                            setLoading(false);
                          })
                          .catch((e) => {
                            console.log(e);
                            alert("Could not search user");
                          });
                      }
                    }}
                  >
                    Search
                  </button>
                ) : (
                  <button
                    class="btn btn-outline-secondary my-2 my-sm-0"
                    style={{ paddingLeft: "1.02rem", paddingRight: "1.02rem" }}
                    onClick={(e) => {
                      e.preventDefault();
                      setSearch("");
                      setSearchResults([]);
                      setSearchToggle(true);
                    }}
                  >
                    Close
                  </button>
                )}
                {!searchToggle ? (
                  <>
                    <div
                      className="search-result-box"
                      style={{
                        width: "13rem",
                        background: "#fff",
                        position: "absolute",
                        top: "3.4rem",
                        zIndex: "1",
                        borderRadius: "2px",
                        border: "1px solid rgba(104, 104, 104, 0.3)",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {!loading ? (
                        searchResults
                          .filter((user) => {
                            return user !== null;
                          })
                          .map((users, index) => {
                            return (
                              <>
                                <div
                                  className="search-users"
                                  key={index}
                                  style={{
                                    display: "flex",
                                    margin: "0.25rem",
                                    marginTop: "0.5rem",
                                    alignItems: "center",
                                  }}
                                >
                                  <div id="user_img_container">
                                    <img id="user_img" src={users.profilePic} />
                                  </div>
                                  <Link
                                    style={{
                                      textDecoration: "none",
                                      color: "#000",
                                    }}
                                    to={{
                                      pathname: "/visiting-profile",
                                      state: {
                                        User: user,
                                        visitingUser: users,
                                      },
                                    }}
                                  >
                                    <h6
                                      style={{
                                        marginBottom: "0",
                                        paddingLeft: "0.5rem",
                                        fontSize: "1.15rem",
                                      }}
                                    >
                                      {users.username}
                                    </h6>
                                  </Link>
                                </div>

                                <hr
                                  style={{ width: "100%", marginBottom: "0" }}
                                ></hr>
                              </>
                            );
                          })
                      ) : (
                        <img
                          src={spinner}
                          style={{ width: "100%", textAlign: "center" }}
                        ></img>
                      )}
                    </div>
                  </>
                ) : null}
                <Link className="mx-5" to="/logout">
                  <button
                    class="btn btn-outline-success my-2 my-sm-0"
                    type="submit"
                  >
                    Logout
                  </button>
                </Link>
              </form>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Navbar;

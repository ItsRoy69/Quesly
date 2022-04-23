import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import "../Styles/Home.css";
// import user.profilePic from "../Images/user.profilePic1.jpg";
import Button from "@mui/material/Button";
import Loading from "../Components/Loading";
import { Link } from "react-router-dom";

function Business() {
  const User =
    JSON.parse(localStorage.getItem("user_info")) ||
    JSON.parse(sessionStorage.getItem("user_info"));

  const username = User.username;

  const [businessQueries, setBusinessQueries] = useState([]);
  const [query, setQuery] = useState({
    category: "business",
    question: "",
    username: "",
  });

  const [submit, setSubmit] = useState(false);
  const [callApi, setCallApi] = useState(false);
  const [user, setUser] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [toggleAnswer, setToggleAnswer] = useState(false);
  const [index, setIndex] = useState("");
  const [index2, setIndex2] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadAnswers, setLoadAnswers] = useState(false);
  const [userAnswer, setUserAnswer] = useState({
    id: "",
    answer: "",
    username: "",
  });

  const fetchBusinessQueries = async () => {
    await axios
      .get("https://quesly-backend.herokuapp.com/get-business-queries")
      .then((response) => {
        console.log(response);
        setBusinessQueries(response.data);
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  let name, value;

  const inputsHandler = (e) => {
    name = e.target.name;
    value = e.target.value;
    setQuery({ ...query, [name]: value, username: user.username });
  };

  const submitHandler = async (e) => {
    const profilePic = user.profilePic;
    e.preventDefault();
    setSubmit(true);
    if (query.category === "business") {
      const { question, category, username } = query;
      const data = { question, category, username, profilePic };

      await axios
        .post("https://quesly-backend.herokuapp.com/post-question", data, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          setCallApi(!callApi);

          console.log(response);
        })
        .catch((e) => {
          alert("Failed to Post Question!");
          console.log(e);
        });
      setQuery({ ...query, question: "" });
    }
  };
  const getUser = async () => {
    await axios
      .post("https://quesly-backend.herokuapp.com/getUser", {
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

  const CategoryCheck = () => {
    return (
      <p style={{ paddingTop: "1rem", color: "red" }}>Posting in Business</p>
    );
  };

  const inputAnswer = (e, id) => {
    setUserAnswer({
      ...userAnswer,
      answer: e.target.value,
      id: id,
      username: user.username,
      profilePic: user.profilePic,
    });
  };

  const submitAnswer = async (e) => {
    await axios
      .post("https://quesly-backend.herokuapp.com/post-answer", userAnswer, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response);
        setLoadAnswers(!loadAnswers);

      })
      .catch((e) => {
        console.log(e);
        alert("Could not Post Answer!");
      });
    setUserAnswer({ ...userAnswer, answer: "", id: "" });
  };
  console.log(userAnswer);
  const showAnswerSection = async (index) => {
    let i = index;
    setIndex(index);
    setIndex2(i);
    if (index === i) {
      setShowAnswer(true);
      setToggleAnswer(!toggleAnswer);
    }
  };

  const DeleteAnswer = async (aid) => {
    const data = { aid };
    await axios
      .post("https://quesly-backend.herokuapp.com/delete-answer", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setLoadAnswers(!loadAnswers);

        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("Could Not Delete Answer!");
      });
  };

  const postUpvote = async (id) => {
    const username = user.username;
    const data = { id, username };
    // setUpvoteUser(username);
    // setUpvoteIndex((upvoteIndex) => [...upvoteIndex, index]);

    await axios
      .post("https://quesly-backend.herokuapp.com/post-upvote", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setLoadAnswers(!loadAnswers);

        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("Question not Upvoted!");
      });
  };

  const postAnswerUpvote = async (qid, aid) => {
    const username = user.username;
    const data = { qid, aid, username };
    // setUpvoteUser(username);
    // setUpvoteIndex((upvoteIndex) => [...upvoteIndex, index]);

    await axios
      .post("https://quesly-backend.herokuapp.com/post-answer-upvote", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setLoadAnswers(!loadAnswers);

        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("Answer not Upvoted!");
      });
  };

  const removeAnswerUpvote = async (qid, aid) => {
    const username = user.username;
    const data = { qid, aid, username };
    // setUpvoteUser(username);
    // setUpvoteIndex((upvoteIndex) => [...upvoteIndex, index]);

    await axios
      .post("https://quesly-backend.herokuapp.com/remove-answer-upvote", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setLoadAnswers(!loadAnswers);

        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("Answer Upvote not Removed!");
      });
  };

  const unpostUpvote = async (id) => {
    const username = user.username;
    const data = { id, username };
    // setUpvoteUser(username);
    // setUpvoteIndex((upvoteIndex) => [...upvoteIndex, index]);

    await axios
      .post("https://quesly-backend.herokuapp.com/post-downvote", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setLoadAnswers(!loadAnswers);

        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("Question not Downvoted!");
      });
  };

  const postAnswerDownvote = async (qid, aid) => {
    const username = user.username;
    const data = { qid, aid, username };
    // setUpvoteUser(username);
    // setUpvoteIndex((upvoteIndex) => [...upvoteIndex, index]);

    await axios
      .post("https://quesly-backend.herokuapp.com/post-answer-downvote", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setLoadAnswers(!loadAnswers);

        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("Answer not Downvoted!");
      });
  };

  const removeAnswerDownvote = async (qid, aid) => {
    const username = user.username;
    const data = { qid, aid, username };
    // setUpvoteUser(username);
    // setUpvoteIndex((upvoteIndex) => [...upvoteIndex, index]);

    await axios
      .post("https://quesly-backend.herokuapp.com/remove-answer-downvote", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setLoadAnswers(!loadAnswers);

        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("Downvote not Removed!");
      });
  };

  const upvoteStatus = (elem) => {
    const Upvoted = elem.upvotes.find((elem) => {
      return elem.username === user.username;
    });

    if (!Upvoted) {
      return (
        <>
          <div id="upvote-wrapper" onClick={() => postUpvote(elem._id)}>
            <i
              style={{
                fontSize: "2rem",
                marginLeft: "1.25rem",
              }}
              class="fa fa-arrow-up"
              aria-hidden="true"
            ></i>
            <p
              style={{
                marginBottom: "0",
                marginLeft: "0.5rem",
                fontWeight: "700",
                marginRight: "1rem",
              }}
            >
              Upvotes {elem.upvotes.length}
            </p>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div id="upvote-wrapper" onClick={() => unpostUpvote(elem._id)}>
            <i
              style={{
                fontSize: "2rem",
                marginLeft: "1.25rem",
                color: "#3498db",
              }}
              class="fa fa-arrow-up"
              aria-hidden="true"
            ></i>
            <p
              style={{
                marginBottom: "0",
                marginLeft: "0.5rem",
                fontWeight: "900",
                marginRight: "1rem",
                color: "#3498db",
              }}
            >
              Upvoted {elem.upvotes.length}
            </p>
          </div>
        </>
      );
    }
  };

  const upvoteAnswerStatus = (elem, element) => {
    const Upvoted = element.upvotes.find((element) => {
      return element.username === user.username;
    });

    const Downvoted = element.downvotes.find((element) => {
      return element.username === user.username;
    });

    if (!Upvoted && !Downvoted) {
      return (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {Upvoted ? (
              <>
                <i
                  style={{
                    fontSize: "1.25rem",
                    cursor: "pointer",
                    color: "#3498db",
                  }}
                  class="fa fa-arrow-up"
                  aria-hidden="true"
                  onClick={() => postAnswerUpvote(elem._id, element._id)}
                ></i>
                <p
                  style={{
                    margin: "0",
                    paddingLeft: "0.5rem",
                    color: "#3498db",
                    fontWeight: "bold",
                  }}
                >
                  {element.upvotes.length}
                </p>
              </>
            ) : (
              <>
                <i
                  style={{ fontSize: "1.25rem", cursor: "pointer" }}
                  class="fa fa-arrow-up"
                  aria-hidden="true"
                  onClick={() => postAnswerUpvote(elem._id, element._id)}
                ></i>
                <p
                  style={{
                    margin: "0",
                    paddingLeft: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  {element.upvotes.length}
                </p>
              </>
            )}

            {Downvoted ? (
              <>
                <i
                  style={{
                    fontSize: "1.25rem",
                    marginLeft: "1rem",
                    cursor: "pointer",
                    color: "#3498db",
                  }}
                  class="fa fa-arrow-down"
                  aria-hidden="true"
                  onClick={() => postAnswerDownvote(elem._id, element._id)}
                ></i>
                <p
                  style={{
                    margin: "0",
                    paddingLeft: "0.5rem",
                    color: "#3498db",
                    fontWeight: "bold",
                  }}
                >
                  {element.downvotes.length}
                </p>
              </>
            ) : (
              <>
                <i
                  style={{
                    fontSize: "1.25rem",
                    marginLeft: "1rem",
                    cursor: "pointer",
                  }}
                  class="fa fa-arrow-down"
                  aria-hidden="true"
                  onClick={() => postAnswerDownvote(elem._id, element._id)}
                ></i>
                <p
                  style={{
                    margin: "0",
                    paddingLeft: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  {element.downvotes.length}
                </p>
              </>
            )}
          </div>
        </>
      );
    } else {
      return (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {Upvoted ? (
              <>
                <i
                  style={{
                    fontSize: "1.25rem",
                    cursor: "pointer",
                    color: "#3498db",
                  }}
                  class="fa fa-arrow-up"
                  aria-hidden="true"
                  onClick={() => removeAnswerUpvote(elem._id, element._id)}
                ></i>
                <p
                  style={{
                    margin: "0",
                    paddingLeft: "0.5rem",
                    color: "#3498db",
                    fontWeight: "bold",
                  }}
                >
                  {element.upvotes.length}
                </p>
              </>
            ) : (
              <>
                <i
                  style={{ fontSize: "1.25rem", cursor: "pointer" }}
                  class="fa fa-arrow-up"
                  aria-hidden="true"
                  onClick={() => removeAnswerUpvote(elem._id, element._id)}
                ></i>
                <p
                  style={{
                    margin: "0",
                    paddingLeft: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  {element.upvotes.length}
                </p>
              </>
            )}
            {Downvoted ? (
              <>
                <i
                  style={{
                    fontSize: "1.25rem",
                    marginLeft: "1rem",
                    cursor: "pointer",
                    color: "#3498db",
                  }}
                  class="fa fa-arrow-down"
                  aria-hidden="true"
                  onClick={() => removeAnswerDownvote(elem._id, element._id)}
                ></i>
                <p
                  style={{
                    margin: "0",
                    paddingLeft: "0.5rem",
                    color: "#3498db",
                    fontWeight: "bold",
                  }}
                >
                  {element.downvotes.length}
                </p>
              </>
            ) : (
              <>
                <i
                  style={{
                    fontSize: "1.25rem",
                    marginLeft: "1rem",
                    cursor: "pointer",
                  }}
                  class="fa fa-arrow-down"
                  aria-hidden="true"
                  onClick={() => removeAnswerDownvote(elem._id, element._id)}
                ></i>
                <p
                  style={{
                    margin: "0",
                    paddingLeft: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  {element.downvotes.length}
                </p>
              </>
            )}
          </div>
        </>
      );
    }
  };

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
    if (user.following) {
      const Followed = user.following.find((followedUser) => {
        return followedUser.username === username;
      });
      if (user.username === username) {
        return null;
      } else {
        if (Followed === undefined) {
          return (
            <p
              onClick={() => followUser(user.username, username)}
              style={{
                margin: "0",
                paddingLeft: "1rem",
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
                paddingLeft: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                color: "#f19066",
              }}
            >
              Following
            </p>
          );
        }
      }
    }
  };

  const history = useHistory();

  if (sessionStorage.getItem("token")) {
    var token = sessionStorage.getItem("token");
  } else {
    token = localStorage.getItem("token");
  }

  useEffect(() => {
    getUser();
  }, [callApi]);

  useEffect(() => {
    fetchBusinessQueries();
  }, [callApi || loadAnswers]);

  console.log(businessQueries);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {token ? (
        <>
          <Navbar />
          <div
            style={{
              background: "#f1f2f2",
              minHeight: "100vh",
              maxHeight: "max-content",
            }}
            class="container-fluid"
          >
            <div id="home-wrapper" class="row">
              <div id="dummy" class="col-0 col-md-3 col-lg-3"></div>
              <div id="questionWrapper" class="col-12 col-md-6 col-lg-6">
                <div id="user_info_wrapper">
                  <div className="question-box">
                    <div id="inner_question">
                      <div id="user_info">
                        <div id="user_img_container">
                          <img id="user_img" src={user.profilePic} />
                        </div>
                        <h4
                          style={{
                            marginBottom: "0",
                            paddingLeft: "1rem",
                            textTransform: "capitalize",
                          }}
                        >
                          {user.username}
                        </h4>
                      </div>

                      <textarea
                        value={query.question}
                        name="question"
                        onChange={inputsHandler}
                      />
                      <div id="button_container">
                        <CategoryCheck />
                        <Button
                          onClick={submitHandler}
                          id="question_post"
                          variant="outlined"
                        >
                          Post A Question
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                {businessQueries.map((elem, index) => {
                  return (
                    <div id="posts" key={index}>
                      <div id="post-wrapper">
                        <div id="user-outer">
                          <div id="user_info">
                            <div id="user_img_container">
                              <img id="user_img" src={elem.profilePic} />
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Link
                                  style={{
                                    textDecoration: "none",
                                    color: "#000",
                                  }}
                                  to={{
                                    pathname: "/visiting-profile",
                                    state: { User: user, visitingUser: elem },
                                  }}
                                >
                                  <h4
                                    style={{
                                      marginBottom: "0",
                                      paddingLeft: "1rem",
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {elem.username}
                                  </h4>
                                </Link>
                                {followStat(user, elem.username)}
                              </div>
                              <p
                                style={{
                                  margin: "0",
                                  paddingLeft: "1rem",
                                  fontSize: "1rem",
                                  textTransform: "capitalize",
                                }}
                              >
                                {elem.category}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div id="question-wrapper">
                          <p>{elem.question}</p>
                        </div>
                      </div>
                      <div
                        style={{ margin: "0" }}
                        class="dropdown-divider"
                      ></div>

                      <div id="reaction-bar">
                        <div id="inner-reaction-bar">
                          {upvoteStatus(elem)}

                          <div
                            onClick={() => showAnswerSection(index)}
                            id="answer-wrapper"
                          >
                            <i
                              style={{
                                fontSize: "2rem",
                                marginLeft: "1.25rem",
                              }}
                              class="fa fa-comment-o"
                              aria-hidden="true"
                            ></i>
                            <p
                              style={{
                                marginBottom: "0",
                                marginLeft: "0.5rem",
                                fontWeight: "700",
                                marginRight: "1.25rem",
                              }}
                            >
                              Answers {elem.answers.length}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{ margin: "0" }}
                        class="dropdown-divider"
                      ></div>

                      {index == index2 && showAnswer ? (
                        <>
                          <div id="answers-wrapper" key={index}>
                            <div id="add-answer">
                              <div id="answer_user_info">
                                <div id="user_img_container">
                                  <img id="user_img" src={user.profilePic} />
                                </div>

                                <input
                                  id="add_answer"
                                  placeholder="Add an answer..."
                                  value={userAnswer.answer}
                                  onChange={(e) => {
                                    inputAnswer(e, elem._id);
                                  }}
                                ></input>

                                <Button
                                  style={{
                                    position: "relative",
                                    marginRight: "4rem",
                                  }}
                                  onClick={() => submitAnswer(elem._id)}
                                  color="primary"
                                  variant="contained"
                                >
                                  Add Answer
                                </Button>
                                <i
                                  onClick={() => setShowAnswer(false)}
                                  style={{
                                    marginBottom: "1.5rem",
                                    cursor: "pointer",
                                    fontSize: "1.25rem",
                                  }}
                                  class="fa fa-times"
                                  aria-hidden="true"
                                ></i>
                              </div>
                            </div>

                            <div
                              style={{ marginBottom: "0" }}
                              class="dropdown-divider"
                            ></div>

                            <div id="answer_section">
                              {elem.answers.map((element, i) => {
                                return (
                                  <div style={{ marginTop: "0.8rem" }}>
                                    <div
                                      id="user_info"
                                      style={{
                                        height: "3rem",
                                        justifyContent: "space-between",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          height: "100%",
                                          alignItems: "center",
                                          marginLeft: "1.5rem",
                                        }}
                                      >
                                        <div id="answer_user_img_container">
                                          <img
                                            id="answer_user_img"
                                            src={element.profilePic}
                                          />
                                        </div>
                                        <h5
                                          style={{
                                            marginBottom: "0",
                                            paddingLeft: "0.5rem",
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {element.username}
                                        </h5>
                                      </div>
                                      {user.username === element.username ||
                                      elem.username === user.username ? (
                                        <>
                                          <h6
                                            onClick={() =>
                                              DeleteAnswer(element._id)
                                            }
                                            style={{
                                              padding: "1rem",
                                              color: "#636e72",
                                              cursor: "pointer",
                                            }}
                                          >
                                            Delete Answer
                                          </h6>
                                        </>
                                      ) : null}
                                    </div>

                                    <div id="user_answer" key={index}>
                                      <p style={{ marginBottom: "0.5rem" }}>
                                        {element.answer}
                                      </p>
                                      {upvoteAnswerStatus(elem, element)}
                                    </div>
                                    <div
                                      style={{ marginBottom: "0" }}
                                      class="dropdown-divider"
                                    ></div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* <div style={{margin:"0"}} class="dropdown-divider"></div> */}
                          </div>
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div id="dummy" class="col-0 col-md-3 col-lg-3"></div>
            </div>
          </div>
        </>
      ) : (
        history.push("/")
      )}
    </>
  );
}

export default Business;

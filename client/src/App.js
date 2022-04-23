import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Registration from "./Components/Registration";
import Logout from "./Components/Logout";
import Health from "./Components/Health";
import Business from "./Components/Business";
import Lifestyle from "./Components/Lifestyle";
import Education from "./Components/Education";
import Trending from "./Components/Trending";
import ErrorPage from "./Components/ErrorPage";

function App() {
  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");

  return (
    <>
      {token ? (
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />

            <Route path="*" component={ErrorPage} />

            <Route path="/logout" component={Logout} />

            <Route path="/health" component={Health} />

            <Route path="/business" component={Business} />

            <Route path="/lifestyle" component={Lifestyle} />

            <Route path="/education" component={Education} />

            <Route path="/trending" component={Trending} />
          </Switch>
        </Router>
      ) : (
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/register" component={Registration} />
          </Switch>
        </Router>
      )}
    </>
  );
}

export default App;

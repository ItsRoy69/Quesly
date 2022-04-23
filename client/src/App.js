import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Registration from "./Components/Registration";

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

import React, { Component } from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    withRouter,
  } from 'react-router-dom';
import Login from '../views/Login';
import Register from '../views/Register';
import Profile from '../views/Profile';
import Index from '../views/Index';

class GLOBAL_ROUTE extends Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/register" component={withRouter(Register)} />
          <Route path="/profile" component={withRouter(Profile)} />
          <Route path="/index" component={withRouter(Index)} />
        </Switch>
      </Router>
    )
  }
}

export default GLOBAL_ROUTE

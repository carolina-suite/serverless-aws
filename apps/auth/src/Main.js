
import React, { Component } from 'react';
import  { Route, Switch } from 'react-router-dom';

import Check from './components/Check';
import Edit from './components/Edit';
import Forgot from './components/Forgot';
import Login from './components/Login';
import Password from './components/Password';
import Profile from './components/Profile';
import Register from './components/Register';

class Main extends Component {
  render() {
    return (
      <div className="container">
        <div className="columns">
          <div className="col-6 col-mx-auto">
            <Switch>
              <Route exact path="/" component={Check} />
              <Route exact path="/changepass" component={Password} />
              <Route exact path="/edit" component={Edit} />
              <Route exact path="/forgot" component={Forgot} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/register" component={Register} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

export default Main;

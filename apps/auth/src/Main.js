
import React, { Component } from 'react';
import  { Route, Switch } from 'react-router-dom';

import Check from './components/Check';
import Login from './components/Login';
import Register from './components/Register';

class Main extends Component {
  render() {
    return (
      <div className="container">
        <div className="columns">
          <div className="col-6 col-mx-auto">
            <Switch>
              <Route exact path="/" component={Check} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

export default Main;


import React, { Component } from 'react';
import  { Route, Switch } from 'react-router-dom';

import Check from './components/Check';
import Login from './components/Login';

class Main extends Component {
  render() {
    return (
      <div className="container">
        <Switch>
          <Route exact path="/" component={Check} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </div>
    )
  }
}

export default Main;


import React, { Component } from 'react';
import  { Route, Switch } from 'react-router-dom';

import config from '../../_carolina/src/config';

import AppPage from './components/AppPage';
import Check from './components/Check';
import NotAdmin from './components/NotAdmin';
import Panel from './components/Panel';

class Main extends Component {

  constructor(props) {

    super(props);

    this.state = {
      siteName: config.siteName
    };
  }

  render() {
    return (
      <div className="container">
        <div className="columns">
          <div className="col-6 col-mx-auto">

            <h2 className="display">{this.state.siteName} Admin</h2>

            <Switch>
              <Route exact path="/" component={Check} />
              <Route exact path="/app/:appName" component={AppPage} />
              <Route exact path="/notadmin" component={NotAdmin} />
              <Route exact path='/panel' component={Panel} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

export default Main;


import React, { Component } from 'react';
import  { Route, Switch } from 'react-router-dom';

import config from '../../_carolina/src/config';

import Auth from '../../auth/src/lib/Auth';

import AppPage from './components/AppPage';
import Check from './components/Check';
import CreateObject from './components/CreateObject';
import ModelPage from './components/ModelPage';
import NotAdmin from './components/NotAdmin';
import ObjectPage from './components/ObjectPage';
import Panel from './components/Panel';
import SettingsPage from './components/SettingsPage';
import UserInfo from './components/UserInfo';

class Main extends Component {

  constructor(props) {

    super(props);

    this.state = {
      username: null,
      siteName: config.siteName
    };
  }

  async componentDidMount() {
    var user = await Auth.getUser();
    this.setState({
      username: user.username
    });
  }

  render() {
    return (
      <div className="container">
        <div className="columns">
          <div className="col-6 col-mx-auto">

            <h2 className="display">{this.state.siteName} Admin</h2>

            {this.state.username &&
              <UserInfo username={this.state.username} />
            }

            <Switch>
              <Route exact path="/" component={Check} />
              <Route exact path="/app/:appName" component={AppPage} />
              <Route exact path='/app/:appName/settings' component={SettingsPage} />
              <Route exact path="/model/:appName/:modelName" component={ModelPage} />
              <Route exact path="/model/:appName/:modelName/create" component={CreateObject} />
              <Route exact path="/notadmin" component={NotAdmin} />
              <Route exact path="/object/:appName/:modelName/:objectKey" component={ObjectPage} />
              <Route exact path='/panel' component={Panel} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

export default Main;

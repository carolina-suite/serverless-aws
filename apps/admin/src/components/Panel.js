
import React, { Component } from 'react';

import Auth from '../../../auth/src/lib/Auth';

import AppCard from './AppCard';
import UserInfo from './UserInfo';

class Panel extends Component {

  constructor(props) {

    super(props);

    this.handleLogout = null;
    this.state = {
      apps: [],
      username: null
    };
  }

  async componentDidMount() {

    var user = await Auth.getUser();
    this.setState({
      username: user.username
    });

    var models = await Auth.callAPI('admin', 'api', {
      action: 'list-models'
    });
    var appObjects = [];
    for (var property in models) {
      var appObject = { name: property, models: [] };
      for (var i = 0; i < models[property].length; ++i) {
        var modelName = models[property][i];
        if (modelName == 'Settings') {
          appObject.settings = true;
        }
        else {
          appObject.models.push(modelName);
        }
      }
      appObjects.push(appObject);
    }

    this.setState({
      apps: appObjects
    });
  }

  render() {
    return (
      <div>
        {this.state.username &&
          <UserInfo username={this.state.username} />
        }
        {this.state.apps.map((app) => (
          <AppCard appName={app.name} models={app.models} hasSettings={app.settings} />
        ))}
      </div>
    )
  }
}

export default Panel;

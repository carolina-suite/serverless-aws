
import React, { Component } from 'react';
import  { Link } from 'react-router-dom';

import Auth from '../../../auth/src/lib/Auth';

import AppCard from './AppCard';
import UserInfo from './UserInfo';

class AppPage extends Component {

  constructor(props) {

    super(props);

    this.state = {
      apps: null,
      currentApp: props.match.params.appName,
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
    var appObjects = {};
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
      appObjects[property] = appObject;
    }

    this.setState({
      apps: appObjects
    });
  }
  async componentWillReceiveProps(props) {
    if (props.match.params.appName != this.state.currentApp) {
      var appName = props.match.params.appName;
      this.setState({
        currentApp: appName
      });
    }
  }

  render() {
    return(
      <div>

        {this.state.username &&
          <UserInfo username={this.state.username} />
        }

        <ul className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/panel">Admin</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/app/${this.state.currentApp}`}>App: {this.state.currentApp}</Link>
          </li>
        </ul>

        {(this.state.apps && this.state.currentApp) &&
          <AppCard appName={this.state.currentApp} models={this.state.apps[this.state.currentApp].models} hasSettings={this.state.apps[this.state.currentApp].settings} />
        }
      </div>
    )
  }
}

export default AppPage;

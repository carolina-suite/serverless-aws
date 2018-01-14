
import React, { Component } from 'react';
import  { Link } from 'react-router-dom';

import Auth from '../../../auth/src/lib/Auth';

import ObjectEdit from './ObjectEdit';

/**
path: /app/:appName/settings
*/
class SettingsPage extends Component {

  constructor(props) {

    super(props);

    this.state = {
      appName: props.match.params.appName,
      schema: null,
      settingsObj: null
    };
  }

  async componentDidMount() {
    await this.fillState(this.state.appName);
  }
  async componentWillReceiveProps(props) {
    if (props.match.params.appName != this.state.appName) {
      await this.fillState(props.match.params.appName);
    }
  }

  async fillState(appName) {

    var s = await Auth.callAPI('admin', 'api', {
      action: 'schema',
      app: appName,
      model: 'Settings'
    });
    var obj = await Auth.callAPI('admin', 'api', {
      action: 'lookup',
      app: appName,
      model: 'Settings',
      key: 'Settings'
    });

    this.setState({
      appName: appName,
      modelName: 'Settings',
      schema: s,
      settingsObj: obj
    });
  }

  render() {
    return (
      <div>

        <ul className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/panel">Admin</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/app/${this.state.appName}`}>App: {this.state.appName}</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/app/${this.state.appName}/settings`}>Settings</Link>
          </li>
        </ul>

        <br />

        {!!(this.state.appName && this.state.schema) &&
          <ObjectEdit isNew={false} obj={this.state.settingsObj} schema={this.state.schema} appName={this.state.appName} modelName={this.state.modelName} />
        }
      </div>
    )
  }
}

export default SettingsPage;

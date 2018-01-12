
import React, { Component } from 'react';
import  { Link } from 'react-router-dom';

import Auth from '../../../auth/src/lib/Auth';

class CreateObject extends Component {

  constructor(props) {

    super(props);

    this.state = {
      appName: props.match.params.appName,
      modelName: props.match.params.modelName,
      obj: {},
      schema: null
    };
  }

  async componentDidMount() {
    await this.fillState(this.state.appName, this.state.modelName);
  }
  async componentWillReceiveProps(props) {
    if (props.match.params.appName != this.state.appName || props.match.params.modelName != this.state.modelName) {
      await this.fillState(props.match.params.appName, props.match.params.modelName);
    }
  }

  async fillState(app, model) {

    var s = await Auth.callAPI('admin', 'api', {
      action: 'schema',
      app: app,
      model: model
    });
    var starterObject = {};
    for (var property in s.fields) {
      if (s.fields[property].hasOwnProperty('default')) {
        starterObject[property] = s.fields[property].default;
      }
      else {
        if (s.fields[property].type == 'Boolean') {
          starterObject[property] = false;
        }
        if (s.fields[property].type == 'EmailAddress') {
          starterObject[property] = '';
        }
        if (s.fields[property].type == 'String') {
          starterObject[property] = '';
        }
      }
    }

    this.setState({
      appName: app,
      modelName: model,
      obj: starterObject,
      schema: s
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
            <Link to={`/model/${this.state.appName}/${this.state.modelName}`}>Model: {this.state.modelName}</Link>
          </li>
          <li className="breadcrumb-item">
            Create New
          </li>
        </ul>
      </div>
    )
  }
}

export default CreateObject;

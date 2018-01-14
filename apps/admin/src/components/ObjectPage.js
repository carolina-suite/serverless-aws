
import React, { Component } from 'react';
import  { Link } from 'react-router-dom';

import Auth from '../../../auth/src/lib/Auth';

import CommandCard from './CommandCard';
import ObjectEdit from './ObjectEdit';

class ObjectPage extends Component {

  constructor(props) {

    super(props);

    this.state = {
      appName: props.match.params.appName,
      modelName: props.match.params.modelName,
      obj: {},
      objectKey: props.match.params.objectKey,
      schema: null
    };
  }

  async componentDidMount() {
    await this.fillState(this.state.appName, this.state.modelName,
      this.state.objectKey);
  }
  async componentWillReceiveProps(props) {
    if (props.match.params.appName != this.state.appName || props.match.params.modelName != this.state.modelName || props.match.params.objectKey != this.state.objectKey) {
      await this.fillState(props.match.params.appName,
        props.match.params.modelName,
        props.match.params.objectKey);
    }
  }

  async fillState(appName, modelName, objectKey) {

    var s = await Auth.callAPI('admin', 'api', {
      action: 'schema',
      app: appName,
      model: modelName
    });
    var obj = await Auth.callAPI('admin', 'api', {
      action: 'lookup',
      app: appName,
      model: modelName,
      key: objectKey
    });

    this.setState({
      appName: appName,
      modelName: modelName,
      obj: obj,
      objectKey: objectKey,
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
            <Link to={`/object/${this.state.appName}/${this.state.modelName}/${this.state.objectKey}`}>Object: {this.state.objectKey}</Link>
          </li>
        </ul>

        <br />

        {!!(this.state.appName && this.state.modelName && this.state.schema) &&
          <ObjectEdit isNew={false} obj={this.state.obj} schema={this.state.schema} appName={this.state.appName} modelName={this.state.modelName} />
        }
        {!!(this.state.schema && this.state.schema.commands.length > 0) &&
          <div>
            {this.state.schema.commands.map((c) => (
              <CommandCard appName={this.state.appName} modelName={this.state.modelName} objectKey={this.state.objectKey} schema={c} />
            ))}
          </div>
        }
      </div>
    )
  }
}

export default ObjectPage;

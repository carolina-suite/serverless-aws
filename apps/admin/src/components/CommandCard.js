
import React, { Component } from 'react';

import Toast from '../../../_carolina/src/components/spectre/Toast';
import Auth from '../../../auth/src/lib/Auth';

import Admin from '../lib/Admin';
import FieldEdit from './FieldEdit';

/**
Component CommandCard
props: appName, modelName, objectKey, schema
*/
class CommandCard extends Component {

  constructor(props) {

    super(props);

    var obj = Admin.getStarterObjectFromSchema(props.schema);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    var fields = [];
    for (var prop in props.schema.fields) {
      fields.push(prop);
    }

    this.state = {
      appName: props.appName,
      errorMessage: null,
      fields: fields,
      modelName: props.modelName,
      obj: obj,
      objectKey: props.modelKey,
      schema: props.schema,
      successMessage: null
    };
  }

  handleChange(n, v) {
    var obj = this.state.obj;
    obj[n] = v;
    this.setState({
      obj: obj
    });
  }
  async handleSubmit(e) {

    e.preventDefault();

    this.setState({
      errorMessage: null,
      successMessage: null
    });

    var args = this.props.schema.execute.args;
    args.src = {
      app: this.props.appName,
      model: this.props.modelName,
      value: this.props.objectKey
    };

    for (var prop in this.state.obj) {
      args[prop] = this.state.obj[prop];
    }

    var res = await Auth.callAPI('admin', 'api', {
      action: 'command',
      app: this.props.schema.execute.app,
      service: this.props.schema.execute.service,
      args: args
    });
    if (res.message) {
      this.setState({
        successMessage: res.message
      })
    }
    else {
      if (res.errorMessage) {
        this.setState({
          errorMessage: res.errorMessage
        });
      }
      else {
        this.setState({
          errorMessage: "Unknown error."
        });
      }
    }
  }

  render() {

    let alert = '';

    if (this.state.errorMessage) {
      alert = <Toast severity="error" lead="Oh No!" body={this.state.errorMessage} />
    }
    else if (this.state.successMessage) {
      alert = <Toast severity="success" lead="Great!" body={this.state.successMessage} />
    }

    return (
      <div className="card">
        <div className="card-header">

          <div className="card-title h5">{this.props.schema.name}</div>
          <div className="card-subtitle text-gray">{this.props.schema.description}</div>

          {alert}
        </div>
        <div className="card-body">
          <form className="form-horizontal" onSubmit={this.handleSubmit}>

            {this.state.fields.map((f => (
              <FieldEdit schema={this.props.schema.fields[f]} isNew={true} value={this.state.obj[f]}  onChange={this.handleChange} />
            )))}

            <button className="btn" type="submit">Execute Command</button>
          </form>
        </div>
      </div>
    )
  }
}

export default CommandCard;


import React, { Component } from 'react';

import FieldEdit from './FieldEdit';

import Auth from '../../../auth/src/lib/Auth';

/**
Component ObjectEdit
Props: appName, modelName, isNew, schema, obj
*/
class ObjectEdit extends Component {

  constructor(props) {

    super(props);

    var isNew = props.isNew;
    var obj = props.obj;
    var schema = props.schema;

    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    var fields = [];
    for (var prop in props.schema.fields) {
      fields.push(prop);
    }

    this.state = {
      fields: fields,
      obj: props.obj
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

    var params = {
      action: 'create',
      app: this.props.appName,
      model: this.props.modelName,
      obj: this.state.obj
    };

    if (!this.props.isNew) params.action = 'update';

    var res = await Auth.callAPI('admin', 'api', params);

    if (res.success) {
      if (this.props.modelName == 'Settings') window.location.hash = `#/app/${this.props.appName}`;
      else window.location.hash = `#/model/${this.props.appName}/${this.props.modelName}`;
    }
    else if (res.errorMessage) {
      alert(res.errorMessage);
    }
    else {
      alert("Unknown error.");
    }
  }
  async handleDelete(e) {

    e.preventDefault();

    var params = {
      action: 'delete',
      app: this.props.appName,
      model: this.props.modelName,
      value: this.state.obj[this.props.schema.keyField]
    };

    var res = await Auth.callAPI('admin', 'api', params);

    if (res.success) {
      if (this.props.modelName == 'Settings') window.location.hash = `#/app/${this.props.appName}`;
      else window.location.hash = `#/model/${this.props.appName}/${this.props.modelName}`;
    }
    else if (res.errorMessage) {
      alert(res.errorMessage);
    }
    else {
      alert("Unknown error.");
    }
  }


  render() {
    return (
      <div>

        <form className="form-horizontal" onSubmit={this.handleSubmit}>
          {this.state.fields.map((f => (
            <FieldEdit schema={this.props.schema.fields[f]} isNew={this.props.isNew} value={this.state.obj[f]}  onChange={this.handleChange} />
          )))}
          {!!(this.props.isNew) &&
            <button className="btn btn-success" onClick={this.handleSubmit}>Add</button>
          }
          {!(this.props.isNew) &&
            <button className="btn btn-primary" onClick={this.handleSubmit}>Save</button>
          }
          {!!(!this.props.isNew && !this.props.schema.singleton) &&
            <button className="btn btn-error" onClick={this.handleDelete}>Delete</button>
          }
        </form>
      </div>
    )
  }
}

export default ObjectEdit;

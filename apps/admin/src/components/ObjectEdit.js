
import React, { Component } from 'react';

import FieldEdit from './FieldEdit';

class ObjectEdit extends Component {

  constructor(props) {

    super(props);

    var isNew = props.isNew;
    var obj = props.obj;
    var schema = props.schema;

    this.handleChange = this.handleChange.bind(this);
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
  }

  render() {
    return (
      <div>
        <form className="form-horizontal" onSubmit={this.handleSubmit}>
          {this.state.fields.map((f => (
            <FieldEdit schema={this.props.schema.fields[f]} value={this.state.obj[f]}  onChange={this.handleChange}/>
          )))}
          {!!(this.props.isNew) &&
            <button className="btn btn-success">Add</button>
          }
          {!(this.props.isNew) &&
            <button className="btn btn-primary">Save</button>
          }
        </form>
      </div>
    )
  }
}

export default ObjectEdit;

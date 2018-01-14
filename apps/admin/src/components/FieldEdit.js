
import React, { Component } from 'react';

import FieldDisplay from './FieldDisplay';

/**
Props: schema, value
*/
class FieldEdit extends Component {

  constructor(props) {

    super(props);

    this.handleBoolean = this.handleBoolean.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    this.props.onChange(this.props.schema.name, e.target.value);
  }
  handleBoolean(e) {
    e.preventDefault();
    this.props.onChange(this.props.schema.name, e.target.checked);
  }

  render() {

    let inputHtml = '';

    if (!this.props.isNew && !this.props.schema.edit) {
      inputHtml = (<FieldDisplay field={this.props.schema} value={this.props.value} />)
    }
    else {
      if (this.props.schema.type == 'Boolean') {
        inputHtml = (
          <label>
            <input type="checkbox" checked={this.props.value} onChange={this.handleBoolean}/>
          </label>
        );
      }
      if (this.props.schema.type == 'EmailAddress') {
        inputHtml = (<input className="form-input" type="text" required={this.props.schema.required} value={this.props.value} onChange={this.handleChange} />)
      }
      if (this.props.schema.type == 'String') {
        inputHtml = (<input className="form-input" type="text" required={this.props.schema.required} value={this.props.value} onChange={this.handleChange} />)
      }
    }

    return (
      <div className="columns form-group">
        <div className="col-3">
          <label className="form-label">{this.props.schema.verbose}</label>
        </div>
        <div className="col-9">
          {inputHtml}
          {!!(this.props.schema.description) &&
            <p className="text-gray">{this.props.schema.description}</p>
          }
        </div>
      </div>
    )
  }
}

export default FieldEdit;

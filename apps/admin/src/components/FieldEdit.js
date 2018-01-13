
import React, { Component } from 'react';

/**
Props: schema, value
*/
class FieldEdit extends Component {

  constructor(props) {

    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    this.props.onChange(this.props.schema.name, e.target.value);
  }

  render() {

    let inputHtml = '';

    if (this.props.schema.type == 'Boolean') {
      inputHtml = (
        <label className="form-switch">
          <input type="checkbox" checked={this.props.value} />
        </label>
      );
    }
    if (this.props.schema.type == 'EmailAddress') {
      inputHtml = (<input className="form-input" type="text" required={this.props.schema.required} value={this.props.value} onChange={this.handleChange} />)
    }
    if (this.props.schema.type == 'String') {
      inputHtml = (<input className="form-input" type="text" required={this.props.schema.required} value={this.props.value} onChange={this.handleChange} />)
    }

    return (
      <div className="columns form-group">
        <div className="col-3">
          <label className="form-label">{this.props.schema.verbose}</label>
        </div>
        <div className="col-9">
          {inputHtml}
          {!!(this.props.schema.description) &&
            <p>{this.props.schema.description}</p>
          }
        </div>
      </div>
    )
  }
}

export default FieldEdit;

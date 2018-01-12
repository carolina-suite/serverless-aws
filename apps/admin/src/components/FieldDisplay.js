
import React, { Component } from 'react';

class FieldDisplay extends Component {

  constructor(props) {

    super(props);

    var field = props.field;
    var value = props.value;
  }

  render() {
    if (this.props.field.type == 'Boolean') {
      if (this.props.value) {
        return (
          <span className="text-success">TRUE</span>
        )
      }
      else {
        return (
          <span className="text-error">FALSE</span>
        )
      }
    }
    if (this.props.field.type == 'EmailAddress') {
      return (
        <a href={`mailto:${this.props.value}`}>{this.props.value}</a>
      )
    }
    if (this.props.field.type == 'String') {
      return (
        <span>{this.props.value}</span>
      )
    }
  }
}

export default FieldDisplay;


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
    if (this.props.field.type == 'Code' || this.props.field.type == 'Text') {
      return (
        <pre><code>{this.props.value}</code></pre>
      )
    }
    if (this.props.field.type == 'EmailAddress') {
      return (
        <a href={`mailto:${this.props.value}`}>{this.props.value}</a>
      )
    }
    if (this.props.field.type == 'File') {
      if (this.props.field.public) {
        return (
          <a href={`/${this.props.value.s3Key}`}>{this.props.value.fileName}</a>
        )
      }
      else {
        return (
          <span>{this.props.value.fileName}</span>
        )
      }
    }
    if (this.props.field.type == 'Id' || this.props.field.type == 'RegularExpression') {
      return (
        <span><tt>{this.props.value}</tt></span>
      )
    }
    if (this.props.field.type == 'StringEnum' || this.props.field.type == 'String') {
      return (
        <span>{this.props.value}</span>
      )
    }
    if (this.props.field.type == 'List') {
      return (
        <ul>
          {this.props.value.map((i) => (
            <li>
              <FieldDisplay field={this.props.field.subSchema} value={i} />
            </li>
          ))}
        </ul>
      )
    }
  }
}

export default FieldDisplay;

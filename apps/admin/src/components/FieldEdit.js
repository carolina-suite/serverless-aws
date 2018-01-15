
import React, { Component } from 'react';

import CodeMirror from 'react-codemirror';
import Dropzone from 'react-dropzone';

import FieldDisplay from './FieldDisplay';

/**
Props: schema, value
*/
class FieldEdit extends Component {

  constructor(props) {

    super(props);

    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handleBoolean = this.handleBoolean.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async getFileBase64(file) {
    return new Promise(function(resolve, reject) {
      let reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(';base64,')[1]);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  handleChange(e) {
    e.preventDefault();
    this.props.onChange(this.props.schema.name, e.target.value);
  }
  handleBoolean(e) {
    e.preventDefault();
    this.props.onChange(this.props.schema.name, e.target.checked);
  }
  async handleFileDrop(files) {

    var file = files[0];
    var b64 = await this.getFileBase64(file);

    this.props.onChange(this.props.schema.name, {
      base64: b64,
      fileName: file.name,
      s3Key: this.props.value.s3Key
    });
  }

  render() {

    let inputHtml = '';

    if ((!this.props.isNew && !this.props.schema.edit) || this.props.schema.type == 'Id') {
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
      if (this.props.schema.type == 'Code') {
        inputHtml = (
          <CodeMirror value={this.props.value} onChange={this.handleChange} options={{lineNumbers:true, mode:{name:this.props.schema.lang}}} />
        )
      }
      if (this.props.schema.type == 'EmailAddress') {
        inputHtml = (<input className="form-input" type="text" required={this.props.schema.required} value={this.props.value} onChange={this.handleChange} />)
      }
      if (this.props.schema.type == 'File') {
        inputHtml = (
          <div>

            <p>{this.props.value.fileName}</p>

            <Dropzone onDrop={this.handleFileDrop} />
          </div>
        )
      }
      if (this.props.schema.type == 'String') {
        inputHtml = (<input className="form-input" type="text" required={this.props.schema.required} value={this.props.value} onChange={this.handleChange} />)
      }
      if (this.props.schema.type == 'StringEnum') {
        inputHtml = (
          <select className="form-input" value={this.props.value} onChange={this.handleChange}>
            {this.props.schema.choices.map((c) => (
              <option value={c}>{c}</option>
            ))}
          </select>
        )
      }
      if (this.props.schema.type == 'Text') {
        inputHtml = (<textarea className="form-input" type="text" required={this.props.schema.required} value={this.props.value} onChange={this.handleChange} />)
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

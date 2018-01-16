
import React, { Component } from 'react';

import CodeMirror from 'react-codemirror';
import Dropzone from 'react-dropzone';

import FieldDisplay from './FieldDisplay';

import Admin from '../lib/Admin';

/**
Props: schema, name, value
*/
class FieldEdit extends Component {

  constructor(props) {

    super(props);

    this.handleBoolean = this.handleBoolean.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handleListAppend = this.handleListAppend.bind(this);
    this.handleListConfirm = this.handleListConfirm.bind(this);
    this.handleListItem = this.handleListItem.bind(this);
    this.handleListRemove = this.handleListRemove.bind(this);

    this.state = {
      value: this.props.value
    };
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
    this.props.onChange(this.props.name, e.target.value);
  }
  handleBoolean(e) {
    e.preventDefault();
    this.props.onChange(this.props.name, e.target.checked);
  }
  async handleFileDrop(files) {

    var file = files[0];
    var b64 = await this.getFileBase64(file);

    this.props.onChange(this.props.name, {
      base64: b64,
      fileName: file.name,
      s3Key: this.props.value.s3Key
    });
  }
  handleListItem(indexString, v) {
    this.state.value[parseInt(indexString)] = v;
  }
  handleListAppend() {

    var starterObject = Admin.getStarterObjectFromSchema({
      fields: {
        fieldName: this.props.schema
      }
    });
    var value = this.state.value;

    value.push(starterObject.fieldName);
    this.setState({
      value: value
    });
  }
  handleListRemove(e) {
    var index = parseInt(e.target.name);
  }
  handleListConfirm() {
    this.props.onChange(this.props.name, this.state.value);
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
      if (this.props.schema.type == 'Integer') {
        inputHtml = (<input className="form-input" type="number" min={this.props.schema.min} max={this.props.schema.max} step="1" value={this.props.value} onChange={this.handleChange} />)
      }
      if (this.props.schema.type == 'Number') {
        inputHtml = (<input className="form-input" type="number" min={this.props.schema.min} max={this.props.schema.max} value={this.props.value} onChange={this.handleChange} />)
      }
      if (this.props.schema.type == 'RegularExpression' || this.props.schema.type == 'String') {
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
      if (this.props.schema.type == 'List') {
        inputHtml = (
          <div>

            {this.state.value.map((i, index) =>(
              <div>

                <FieldEdit name={`${index}`} schema={this.props.schema.subSchema} value={i} onChange={this.handleListItem} />

                <button className="btn btn-error" name={`${index}`} onClick={this.handleListRemove}>
                  <i className="icon icon-cross"></i> Remove
                </button>

                <hr />
              </div>
            ))}

            <p>
              <button className="btn btn-primary" onClick={this.handleListAppend}>
                <i className="icon icon-plus"></i> Add
              </button>
            </p>
            <p>
              <button className="btn btn-success" onClick={this.handleListConfirm}>
                <i className="icon icon-check"></i> Confirm List Contents
              </button>
            </p>
          </div>
        )
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

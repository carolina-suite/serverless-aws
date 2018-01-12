
import React, { Component } from 'react';
import  { Link } from 'react-router-dom';

import config from '../../../_carolina/src/config';
import Toast from '../../../_carolina/src/components/spectre/Toast';

import Auth from '../lib/Auth';

class Password extends Component {

  constructor(props) {

    super(props);

    this.handleOldPassword = this.handleOldPassword.bind(this);
    this.handleNewPassword = this.handleNewPassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      errorMessage: null,
      newPassword: '',
      oldPassword: '',
      siteName: config.siteName,
      successMessage: null
    };
  }

  handleOldPassword(e) {
    this.setState({
      oldPassword: e.target.value
    });
  }
  handleNewPassword(e) {
    this.setState({
      newPassword: e.target.value
    });
  }
  async handleSubmit(e) {

    e.preventDefault();

    this.setState({
      errorMessage: null,
      successMessage: null
    });
    var res = await Auth.updatePassword(this.state.oldPassword,
      this.state.newPassword);
    if (!res.success) {

      var error = "Unknown error.";

      if (res.errorMessage)
        error = res.errorMessage;

      this.setState({
        errorMessage: error
      });
    }
    else {
      this.setState({
        successMessage: "Your password has been updated."
      });
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
      <div>

        <h3>{this.state.siteName} Account Password</h3>

        {alert}

        <form className="form-horizontal" onSubmit={this.handleSubmit}>
        
          <div className="columns form-group">
            <div className="col-3">
              <label className="form-label">Current Password</label>
            </div>
            <div className="col-9">
              <input className="form-input" type="password" placeholder="old password" required value={this.state.oldPassword} onChange={this.handleOldPassword} />
            </div>
          </div>
          <div className="columns form-group">
            <div className="col-3">
              <label className="form-label">New Password</label>
            </div>
            <div className="col-9">
              <input className="form-input" type="password" placeholder="new password" required value={this.state.newPassword} onChange={this.handleNewPassword} />
            </div>
          </div>

          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
      </div>
    )
  }
}

export default Password;

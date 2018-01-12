
import React, { Component } from 'react';
import  { Link } from 'react-router-dom';

import config from '../../../_carolina/src/config';
import Toast from '../../../_carolina/src/components/spectre/Toast';

import Auth from '../lib/Auth';

class Forgot extends Component {

  constructor(props) {

    super(props);

    this.handleUsername = this.handleUsername.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      email: null,
      siteName: config.siteName,
      successMessage: null,
      username: null
    };
  }

  handleUsername(e) {
    this.setState({
      username: e.target.value
    });
  }
  handleEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  async handleSubmit(e) {

    e.preventDefault();

    this.setState({
      successMessage: null
    });
    var res = await Auth.forgot(this.state.username, this.state.email);
    this.setState({
      successMessage: "If the provided information matches an account, that e-mail will be sent new login credentials."
    });
  }

  render() {
    return (
      <div>

        <h3>{this.state.siteName} Account Recovery</h3>

        <p>
          If you have an e-mail on record here, provide it along with
          your username.
        </p>

        {this.state.successMessage &&
          <Toast severity="success" lead="Ok!" body={this.state.successMessage} />
        }

        <form className="form-horizontal" onSubmit={this.handleSubmit}>

          <div className="columns form-group">
            <div className="col-3">
              <label className="form-label">Username</label>
            </div>
            <div className="col-9">
              <input className="form-input" type="text" placeholder="username" required value={this.state.username} onChange={this.handleUsername} />
            </div>
          </div>
          <div className="columns form-group">
            <div className="col-3">
              <label className="form-label">E-Mail Address</label>
            </div>
            <div className="col-9">
              <input className="form-input" type="text" placeholder="mail@example.com" required value={this.state.email} onChange={this.handleEmail} />
            </div>
          </div>

          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
      </div>
    )
  }
}

export default Forgot;

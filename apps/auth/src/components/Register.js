
import React, { Component } from 'react';
import  { Link } from 'react-router-dom';

import config from '../../../_carolina/src/config';
import Toast from '../../../_carolina/src/components/spectre/Toast';

import Auth from '../lib/Auth';

class Register extends Component {

  constructor(props) {

    super(props);

    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword1 = this.handlePassword1.bind(this);
    this.handlePassword2 = this.handlePassword2.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      username: null,
      password1: null,
      password2: null,
      email: null,
      errorMessage: null,
      successMessage: null,
      siteName: config.siteName
    };
  }

  handleUsername(e) {
    this.setState({
      username: e.target.value
    });
  }
  handlePassword1(e) {
    this.setState({
      password1: e.target.value
    });
  }
  handlePassword2(e) {
    this.setState({
      password2: e.target.value
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
      errorMessage: null,
      successMessage: null
    });

    if (this.state.password1 != this.state.password2) {

      this.setState({
        errorMessage: "Passwords do not match."
      });

      return;
    }
    else {
      var res = await Auth.register(this.state.username, this.state.password1,
        this.state.email);
      if (!res.success) {
        if (res.errorMessage) {
          this.setState({
            errorMessage: res.errorMessage
          });
        }
        else {
          this.setState({
            errorMessage: "Unknown error."
          });
        }
      }
      else {
        this.setState({
          successMessage: "Registration successful. You can now log in by clicking the above link."
        });
      }
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

        <h3>{this.state.siteName} Registration</h3>

        <p>
          Already have an account? <Link to="/login">Log in</Link>.
        </p>

        {alert}

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
              <label className="form-label">Password</label>
            </div>
            <div className="col-9">
              <input className="form-input" type="password" placeholder="password" required value={this.state.password1} onChange={this.handlePassword1} />
            </div>
          </div>
          <div className="columns form-group">
            <div className="col-3">
              <label className="form-label">Confirm Password</label>
            </div>
            <div className="col-9">
              <input className="form-input" type="password" placeholder="password" required value={this.state.password2} onChange={this.handlePassword2} />
            </div>
          </div>
          <div className="columns form-group">
            <div className="col-3">
              <label className="form-label">Email Address</label>
            </div>
            <div className="col-9">
              <input className="form-input" type="text" placeholder="user@example.com" value={this.state.email} onChange={this.handleEmail} />
            </div>
          </div>

          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
      </div>
    )
  }
}

export default Register;

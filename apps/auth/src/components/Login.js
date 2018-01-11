
import React, { Component } from 'react';
import  { Link } from 'react-router-dom';

import config from '../../../_carolina/src/config';
import Toast from '../../../_carolina/src/components/spectre/Toast';

import Auth from '../lib/Auth';

class Login extends Component {

  constructor(props) {

    super(props);

    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      errorMessage: null,
      password: null,
      siteName: config.siteName,
      username: null,
    };
  }

  handleUsername(e) {
    this.setState({
      username: e.target.value
    });
  }
  handlePassword(e) {
    this.setState({
      password: e.target.value
    });
  }
  async handleSubmit(e) {

    e.preventDefault();

    this.setState({
      errorMessage: null
    });

    var loginSuccess = await Auth.login(this.state.username,
       this.state.password);
    if(!loginSuccess) {
      this.setState({
        errorMessage: "There was an error with that username/password combination."
      });
    }
    else {
      Auth.goNext();
    }
  }

  render() {

    let alert = '';

    if (this.state.errorMessage) {
      alert = <Toast severity="error" lead="Oh No!" body={this.state.errorMessage} />
    }

    return(
      <div>

        <h3>{this.state.siteName} Login</h3>

        <p>
          Don't have an account? Go ahead and <Link to='/register'>sign up</Link>.
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
              <input className="form-input" type="password" placeholder="password" required value={this.state.password} onChange={this.handlePassword} />
            </div>
          </div>

          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
      </div>
    )
  }
}

export default Login;

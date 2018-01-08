
import React, { Component } from 'react';
import { render } from 'react-dom';

import config from '../../../_carolina/src/config';

class Login extends Component {

  constructor(props) {

    super(props);

    this.state = {
      siteName: config.siteName
    };
  }

  render() {
    return(
      <form>
        <fieldset>

          <legend>{this.state.siteName} Login</legend>

          <div className="form-group row">

            <label className="col-sm-2">Username</label>

            <input className="form-control" type="text" placeholder="username" required autofocus/>
          </div>
          <div className="form-group row">

            <label className="col-sm-2">Password</label>

            <input className="form-control" placeholder="username" type="password" required />
          </div>
        </fieldset>
      </form>
    )
  }
}

export default Login;


import React, { Component } from 'react';
import  { Link } from 'react-router-dom';

import config from '../../../_carolina/src/config';

import Auth from '../lib/Auth';

class Profile extends Component {

  constructor(props) {

    super(props);

    this.handleLogout = this.handleLogout.bind(this);
    this.state = {
      profile: null,
      ready: false,
      siteName: config.siteName,
      username: null
    };
  }

  async componentDidMount() {
    var profile = await Auth.getUser();
    this.setState({
      profile: profile,
      ready: true,
      username: profile.username
    });
  }

  async handleLogout(e) {

    e.preventDefault();

    await Auth.logout();

    window.location.hash = '#/login';
  }

  render() {

    return (
      <div>

        <h3>{this.state.siteName} Account: {this.state.username}</h3>

        {this.state.profile && this.state.profile.isAdmin &&
          <p>
            <span className="label lablel-primary">ADMIN ACCOUNT</span>
          </p>
        }
        {(!!this.state.profile && !!this.state.profile.name) &&
          <p><b>Name: </b>{this.state.profile.name}</p>
        }
        {(!!this.state.profile && !!this.state.profile.emailAddress) &&
          <p><b>E-Mail Address: </b>{this.state.profile.emailAddress}</p>
        }

        <p>
          <Link className="btn btn-primary" to='/edit'>Edit</Link>
          &nbsp;&nbsp;
          <Link className="btn btn-success" to='/changepass'>Update Password</Link>
          &nbsp;&nbsp;
          <a className="btn btn-error" href="#" onClick={this.handleLogout}>Logout</a>
        </p>
      </div>
    )
  }
}

export default Profile;

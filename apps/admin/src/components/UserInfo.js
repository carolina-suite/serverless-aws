
import React, { Component } from 'react';

import Auth from '../../../auth/src/lib/Auth';

class UserInfo extends Component {

  constructor(props) {

    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  async handleLogout(e) {

    e.preventDefault();

    await Auth.logout();
    window.location = '/';
  }

  render() {
    return(
      <ul className="breadcrumb">
        <li className="breadcrumb-item">
          Welcome, {this.props.username}
        </li>
        <li className="breadcrumb-item">
          <a href="/">Site Home</a>
        </li>
        <li className="breadcrumb-item">
          <a href="/auth/#/profile">View Profile</a>
        </li>
        <li className="breadcrumb-item">
          <a href="#" onClick={this.handleLogout}>Logout</a>
        </li>
      </ul>
    )
  }
}

export default UserInfo;

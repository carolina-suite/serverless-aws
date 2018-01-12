
import React, { Component } from 'react';

class NotAdmin extends Component {
  render() {
    return(
      <div>

        <p>
          You must be logged in as an admin account to access this page.
        </p>

        <a className="btn" href="/auth">Account</a>
      </div>
    )
  }
}

export default NotAdmin;


import React, { Component } from 'react';

import config from '../../../_carolina/src/config';

import Auth from '../../../auth/src/lib/Auth';

class Check extends Component {

  constructor(props) {

    super(props);

    this.state = {
      siteName: config.siteName
    };
  }

  async componentDidMount() {
    var user = await Auth.getUser();
    if (user && user.isAdmin) window.location.hash = `#/panel`;
    else window.location.hash = `#/notadmin`;
  }

  render() {
    return(
      <div>
        <p>Checking your status...</p>
      </div>
    )
  }
}

export default Check;

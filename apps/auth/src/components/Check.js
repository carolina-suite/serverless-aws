
import React, { Component } from 'react';
import { render } from 'react-dom';

import config from '../../../_carolina/src/config';
import Toast from '../../../_carolina/src/components/spectre/Toast';

import Auth from '../lib/Auth';

class Check extends Component {

  constructor(props) {

    super(props);

    this.state = {
      siteName: config.siteName
    };
  }

  async componentDidMount() {
    var check = await Auth.check();
    console.log(check);
    if (check) window.location.hash = `#/profile`;
    else window.location.hash = `#/login`;
  }

  render() {
    return(
      <div>
        <h2 className="display">{this.state.siteName} Account</h2>

        <p>Checking your status...</p>
      </div>
    )
  }
}

export default Check;

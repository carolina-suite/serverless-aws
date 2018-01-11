
import React, { Component } from 'react';
import  { Link } from 'react-router-dom';

import config from '../../../_carolina/src/config';

import Auth from '../lib/Auth';

class Profile extends Component {

  constructor(props) {

    super(props);

    this.state = {
      profile: null,
      ready: false,
      siteName: config.siteName
    };
  }

  async componentDidMount() {
    var profile = await Auth.getUser();
    this.setSTate({
      profile: profile,
      ready: true
    });
  }

  render() {

    return (
      <div>

        <h3>{this.state.name} Account</h3>

        {}
      </div>
    )
  }
}

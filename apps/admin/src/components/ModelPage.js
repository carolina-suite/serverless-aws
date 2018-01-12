
import React, { Component } from 'react';
import  { Link } from 'react-router-dom';

import UserInfo from './UserInfo';

class ModelPage extends Component {

  constructor(props) {

    super(props);

    this.state = {
      appName: props.match.params.appName,
      modelName: props.match.params.modelName,
      object: [],
      username: null
    };
  }
}

export default ModelPage;

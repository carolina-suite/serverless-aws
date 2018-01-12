
import React, { Component } from 'react';
import  { Link } from 'react-router-dom';

import UserInfo from './UserInfo';

import Auth from '../../../auth/src/lib/Auth';

const PAGE_SIZE = 3;

class ModelPage extends Component {

  constructor(props) {

    super(props);

    this.state = {
      appName: props.match.params.appName,
      modelName: props.match.params.modelName,
      objects: [],
      page: 0,
      username: null
    };
  }

  async componentDidMount() {

    var user = await Auth.getUser();
    this.setState({
      username: user.username
    });

    var res = await Auth.callAPI('admin', 'api', {
      action: 'list',
      app: this.state.appName,
      model: this.state.modelName,
      pageSize: PAGE_SIZE,
      page: 0
    });
    if (!res.errorMessage) {
      this.setState({
        objects: res
      });
    }
  }
  async componentWillReceiveProps(props) {
    if (props.match.params.appName != this.state.appName || props.match.params.modelName != this.state.modelName) {
      var res = await Auth.callAPI('admin', 'api', {
        action: 'list',
        app: this.state.appName,
        model: this.state.modelName,
        pageSize: PAGE_SIZE,
        page: 0
      });
      if (!res.errorMessage) {
        this.setState({
          objects: res
        });
      }
    }
  }

  render() {
    return (
      
    )
  }
}

export default ModelPage;


import React, { Component } from 'react';
import  { Link } from 'react-router-dom';

import config from '../../../_carolina/src/config';

import Auth from '../lib/Auth';

class Edit extends Component {

  constructor(props) {

    super(props);

    this.handleName = this.handleName.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      email: null,
      name: null,
      siteName: config.siteName,
      username: null
    };
  }

  async componentDidMount() {
    let profile = await Auth.getUser();
    this.setState({
      email: profile.emailAddress,
      name: profile.name,
      username: profile.username
    });
  }

  handleEmail(e) {
    this.setState({
      email: e.target.value
    });
  }
  handleName(e) {
    this.setState({
      name: e.target.value
    });
  }
  async handleSubmit(e) {

    e.preventDefault();

    var update = {};

    if (this.state.email) {
      update.emailAddress = this.state.email;
    }
    if (this.state.name) {
      update.name = this.state.name;
    }

    await Auth.updateProfile(update);

    window.location.hash = '#/profile';
  }

  render() {
    return (
      <div>

        <h3>{this.state.siteName} Profile: {this.state.username}</h3>

        <form className="form-horizontal" onSubmit={this.handleSubmit}>
          <div className="columns form-group">
            <div className="col-3">
              <label className="form-label">E-mail Address</label>
            </div>
            <div className="col-9">
              <input className="form-input" type="text" placeholder="mail@example.com" value={this.state.email} onChange={this.handleEmail} />
            </div>
          </div>
          <div className="columns form-group">
            <div className="col-3">
              <label className="form-label">Name</label>
            </div>
            <div className="col-9">
              <input className="form-input" type="text" placeholder="Your Name" value={this.state.name} onChange={this.handleName} />
            </div>
          </div>

          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
      </div>
    )
  }
}

export default Edit;

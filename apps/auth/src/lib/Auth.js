
import axios from 'axios';
import localforage from 'localforage';

import config from '../../../_carolina/src/config';

class AuthLib {

  constructor() {
    var self = this;
    this.db = localforage.createInstance({
      name: 'CarolinaAuth',
      storeName: 'carolina_auth'
    });
    this.currentUser = null;
    this.token = null;
    this.db.getItem('token')
    .then(function(token) {
      self.token = token;
    })
    .catch(function(err) {});
    this.axios = axios.create({
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: function(s) {
        return s < 500;
      }
    });
  }
  async callAPI(app, api, data) {

    if (!data) data = {};
    if (this.token) data.token = this.token;

    var res = await this.axios.post(`${config.apiEndpoint}${app}_${api}`, data);
    return res.data;
  }
  async check() {
    var res = await this.callAPI('auth', 'api', {
      action: 'check'
    });
    if (res.success) return true;
    else return false;
  }
  async forgot(username, emailAddress) {
    return await this.callAPI('auth', 'api', {
      action: 'forgot',
      username: username,
      emailAddress: emailAddress
    });
  }
  async getUser() {
    return await this.callAPI('auth', 'api', {
      action: 'get-user'
    });
  }
  async login(username, password) {

    var res = await this.callAPI('auth', 'api', {
      action: 'login',
      username: username,
      password: password
    });
    if (res.token) {
      this.db.setItem('token', res.token);
      this.token = res.token;
      return true;
    }

    return false;
  }
  async logout() {
    this.db.removeItem('token');
    this.currentUser = null;
    this.token = null;
  }
  async register(username, password, emailAddress) {
    var res = await this.callAPI('auth', 'api', {
      action: 'register',
      username: username,
      password: password,
      emailAddress: emailAddress
    });
    if (res.message) {
      return true;
    }
    else {
      return false;
    }
  }
  async updatePassword(oldPassword, newPassword) {
    var res = await this.callAPI('auth', 'api', {
      action: 'update-password',
      oldPassword: oldPassword,
      newPassword: newPassword
    });
    if (res.success) {
      return true;
    }
    else {
      return false;
    }
  }
  async updateProfile(info) {
    var res = await this.callAPI('auth', 'api', {
      action: 'update-profile',
      info: info
    });
    if (res.success) return true;
    else return false;
  }
}

var Auth = new AuthLib();

export default Auth;
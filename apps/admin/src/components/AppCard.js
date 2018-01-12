
import React, { Component } from 'react';
import  { Link } from 'react-router-dom';

/**
Component AppCard
props: appName, models, hasSettings
*/
class AppCard extends Component {
  render() {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-title h5">
            <Link to={`/app/${this.props.appName}`}>{this.props.appName}</Link>
          </div>
        </div>
        <div className="card-body">
          <ul className="menu">
            {this.props.models.map((modelName) => (
              <li className="menuItem">
                <Link to={`/model/${this.props.appName}/${modelName}`}>{modelName}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default AppCard;

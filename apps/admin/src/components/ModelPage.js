
import React, { Component } from 'react';
import  { Link } from 'react-router-dom';

import Auth from '../../../auth/src/lib/Auth';

import FieldDisplay from './FieldDisplay';

const PAGE_SIZE = 20;

class ModelPage extends Component {

  constructor(props) {

    super(props);

    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.state = {
      appName: props.match.params.appName,
      modelName: props.match.params.modelName,
      modelSchema: null,
      objects: [],
      page: 0,
      username: null
    };
  }

  async componentDidMount() {

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

    var s = await Auth.callAPI('admin', 'api', {
      action: 'schema',
      app: this.state.appName,
      model: this.state.modelName
    });
    if (!s.errorMessage) {
      this.setState({
        schema: s
      });
    }
  }
  async componentWillReceiveProps(props) {
    if (props.match.params.appName != this.state.appName || props.match.params.modelName != this.state.modelName) {

      var appName = props.match.params.appName;
      var modelName = props.match.params.modelName;

      this.setState({
        appName: appName,
        modelName: modelName,
        page: 0
      });

      var objects = await Auth.callAPI('admin', 'api', {
        action: 'list',
        app: appName,
        model: modelName,
        pageSize: PAGE_SIZE,
        page: 0
      });
      if (!objects.errorMessage) {
        this.setState({
          objects: objects
        });
      }

      var s = await Auth.callAPI('admin', 'api', {
        action: 'schema',
        app: appName,
        model: modelName
      });
      if (!s.errorMessage) {
        this.setState({
          schema: s
        });
      }
    }
  }

  async previousPage() {
    var objects = await Auth.callAPI('admin', 'api', {
      action: 'list',
      app: this.state.appName,
      model: this.state.modelName,
      pageSize: PAGE_SIZE,
      page: this.state.page - 1
    });
    if (!objects.errorMessage) {
      this.setState({
        objects: objects,
        page: this.state.page - 1
      });
    }
  }
  async nextPage() {
    var objects = await Auth.callAPI('admin', 'api', {
      action: 'list',
      app: this.state.appName,
      model: this.state.modelName,
      pageSize: PAGE_SIZE,
      page: this.state.page + 1
    });
    if (!objects.errorMessage) {
      this.setState({
        objects: objects,
        page: this.state.page + 1
      });
    }
  }

  render() {
    return (
      <div>

        <ul className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/panel">Admin</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/app/${this.state.appName}`}>App: {this.state.appName}</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/model/${this.state.appName}/${this.state.modelName}`}>Model: {this.state.modelName}</Link>
          </li>
        </ul>

        <Link className="btn btn-primary" to={`/model/${this.state.appName}/${this.state.modelName}/create`}>
          <i className="icon icon-plus"></i> Create
        </Link>

        {(this.state.objects && this.state.schema) &&
          <div>

            <table className="table table-striped">
              <thead>
                <tr>

                  <th>View</th>

                  {this.state.schema.adminFields.map((f) => (
                    <th>{this.state.schema.fields[f].verbose}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {this.state.objects.map((o) => (
                  <tr>

                    <td>
                      <Link to={`/object/${this.state.appName}/${this.state.modelName}/${o[this.state.schema.keyField]}`}>View/Edit</Link>
                    </td>

                    {this.state.schema.adminFields.map((f) => (
                      <td>
                        <FieldDisplay field={this.state.schema.fields[f]} value={o[f]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <br />

            {(!!this.state.page) &&
              <button className="btn btn-error" onClick={this.previousPage}>Previous</button>
            }
            <button className="btn btn-success" onClick={this.nextPage}>More</button>
          </div>
        }
      </div>
    )
  }
}

export default ModelPage;

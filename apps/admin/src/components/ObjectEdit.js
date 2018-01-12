
import React, { Component } from 'react';

class ObjectEdit extends Component {

  constructor(props) {

    super(props);

    var isNew = props.isNew;
    var obj = props.obj;
    var schema = props.schema;

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div>

        <form className="form-horizontal" onSubmit={this.handleSubmit}>

        </form>
      </div>
    )
  }
}

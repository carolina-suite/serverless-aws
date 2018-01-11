
import React, { Component } from 'react';

class Toast extends Component {
  render() {

    let toastClass = 'toast';

    if (this.props.severity) {
      toastClass = toastClass + ' toast-' + this.props.severity;
    }

    return (
      <div>

        <div className={toastClass}>
          <p>
            <b>{this.props.lead}</b> {this.props.body}
          </p>
        </div>

        <br />
      </div>
    )
  }
}

export default Toast;

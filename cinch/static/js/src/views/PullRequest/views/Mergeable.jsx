import React from 'react';
import cx from 'classnames';

require('css/components/Check.css');

function getStatusModifier(status) {
  if (status === true) {
    return 'success';
  }
  if (status === false) {
    return 'danger';
  }
  return 'warning';
}

const Mergeable = React.createClass({
  propTypes: {
    check: React.PropTypes.shape({
      'label': React.PropTypes.string.isRequired,
      'verbose_name': React.PropTypes.string.isRequired,
      'status': React.PropTypes.bool.isRequired,
      'data': React.PropTypes.shape({ }),
    }),
  },

  render() {
    const {check} = this.props;

    const modifier = getStatusModifier(check.status);
    const classes = cx({
      'Check': true,
      [`-t--${modifier}`]: true,
    });

    return (
      <div className={classes}>
        <h4 className="Check__Title">
          <i className="fa fa-code-fork"></i>
          {" "}
          {check['verbose_name']}
        </h4>
      </div>
    );
  }
});

export default Mergeable;

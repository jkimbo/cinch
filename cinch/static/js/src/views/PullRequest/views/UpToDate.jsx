import React from 'react';
import cx from 'classnames';

require('css/components/Check.css');

function getIcon(status) {
  if (status === true) {
    return <i className="fa fa-check"></i>;
  }

  if (status === false) {
    return <i className="fa fa-times"></i>;
  }

  return <i className="fa fa-circle"></i>;
}

function getStatusModifier(status) {
  if (status === true) {
    return 'success';
  }
  if (status === false) {
    return 'danger';
  }
  return 'warning';
}

const UpToDate = React.createClass({
  propTypes: {
    check: React.PropTypes.shape({
      'label': React.PropTypes.string.isRequired,
      'verbose_name': React.PropTypes.string.isRequired,
      'status': React.PropTypes.bool,
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
          {getIcon(check.status)}
          {" "}
          {check['verbose_name']}
        </h4>
      </div>
    );
  }
});

export default UpToDate;

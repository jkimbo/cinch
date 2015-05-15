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

const Jenkins = React.createClass({
  propTypes: {
    baseUrl: React.PropTypes.string.isRequired,
    check: React.PropTypes.shape({
      'label': React.PropTypes.string.isRequired,
      'status': React.PropTypes.bool.isRequired,
      'data': React.PropTypes.shape({
        'jobs': React.PropTypes.arrayOf(React.PropTypes.shape({
          'id': React.PropTypes.number.isRequired,
          'name': React.PropTypes.string.isRequired,
          'status': React.PropTypes.bool,
        }))
      }),
    }),
  },

  getInitialState() {
    return {
      open: (this.props.check.status !== true)
    };
  },

  handleToggle(event) {
    event.preventDefault();
    this.setState({
      open: !this.state.open
    });
  },

  render() {
    const {check, baseUrl} = this.props;
    const {open} = this.state;

    let jobs = [];

    if (check.data.jobs) {
      jobs = check.data.jobs.map(job => {
        const url = `${baseUrl}/job/${job.name}/${job.build_number}/`;

        const statusModifier = getStatusModifier(job.status);
        const itemClasses = cx({
          'Check__Item': true,
          [`Check__Item--${statusModifier}`]: true,
        });

        return (
          <tr className={itemClasses} key={job.id}>
            <td>{getIcon(job.status)}</td>
            <td>
              {job['build_number'] ?
                <a href={url}>#{job['build_number']}</a> : null}
            </td>
            <td>{job.name}</td>
          </tr>
        );
      });
    }

    const modifier = getStatusModifier(check.status);
    const classes = cx({
      'Check': true,
      [`-t--${modifier}`]: true,
    });

    const containerClasses = cx({
      'Check__Container': true,
      'Check__Container--is-open': this.state.open
    });

    return (
      <div className={classes}>
        <h3 className="Check__Title">
          {getIcon(check.status)}
          {" "}
          Jenkins
          <div className="Check__Toggle" onClick={this.handleToggle}>
            {open ? <i className="fa fa-caret-up"></i> :
              <i className="fa fa-caret-down"></i>}
          </div>
        </h3>
        <div className={containerClasses}>
          <table className="table">
            {jobs}
          </table>
        </div>
      </div>
    );
  }
});

export default Jenkins;

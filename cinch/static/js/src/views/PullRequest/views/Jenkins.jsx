import React from 'react';
import cx from 'classnames';

const Jenkins = React.createClass({
  propTypes: {
    check: React.PropTypes.shape({
      'label': React.PropTypes.string.isRequired,
      'status': React.PropTypes.bool.isRequired
    }),
    jobs: React.PropTypes.arrayOf(React.PropTypes.shape({
      'url': React.PropTypes.string.isRequired,
      'name': React.PropTypes.string.isRequired,
      'status': React.PropTypes.bool.isRequired,
      'build_number': React.PropTypes.number
    }))
  },

  render() {
    const {jobs, check} = this.props;

    const _jobs = jobs.map(job => {
      const labelClasses = cx({
        'label': true,
        'label-success': job.status === true,
        'label-warning': job.status === null,
        'label-danger': job.status === false
      });

      return (
        <div className="PullRequest_Job">
          <a href={job.url} className={labelClasses}>
            {job.name}: {job['build_number']}
          </a>
        </div>
      );
    });

    return (
      <div className="Jenkins">
        <h4>
          {check.status === true ?
            <i className="fa fa-check"></i> :
            <i className="fa fa-times"></i>
          }
          {" "}
          Jenkins
        </h4>
        {_jobs}
      </div>
    );
  }
});

export default Jenkins;

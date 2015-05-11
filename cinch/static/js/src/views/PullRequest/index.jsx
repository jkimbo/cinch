import React from 'react';

import Jenkins from './views/Jenkins';


const PullRequest = React.createClass({
  propTypes: {
    pull: React.PropTypes.object.isRequired
  },

  render() {
    const {pull} = this.props;

    const shortHeadSha = pull.head.substr(0, 9);
    const shortMergeSha = pull['merge_head'].substr(0, 9);

    const jenkinsCheck = pull.checks.find((check) => check.label === 'Jenkins');

    return (
      <div className="PullRequest">
        <h3 className="PullRequest__Title">
          <span style={{ color: '#9aa2ab' }}>#{pull.number}</span> {pull.title} <small>by {pull.owner}</small>
        </h3>
        <div className="row">
          <div className="col-md-8">
            <Jenkins check={jenkinsCheck} jobs={pull.jobs} />
          </div>
          <div className="col-md-4">
            <div className="PullRequest__Meta">
              <div className="PullRequest__Commit">
                <a href="">
                  Head: {shortHeadSha}
                </a>
                <br/>
                <a href="">
                  Merge head: {shortMergeSha}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default PullRequest;

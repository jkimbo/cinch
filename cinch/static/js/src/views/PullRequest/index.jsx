import React from 'react';

import Jenkins from './views/Jenkins';
import Mergeable from './views/Mergeable';
import UpToDate from './views/UpToDate';


const PullRequest = React.createClass({
  propTypes: {
    jenkinsUrl: React.PropTypes.string.isRequired,
    pull: React.PropTypes.object.isRequired
  },

  render() {
    const {pull, jenkinsUrl} = this.props;

    const shortHeadSha = pull.head.substr(0, 9);
    let shortMergeSha = pull['merge_head'];
    if (shortMergeSha) {
      shortMergeSha = shortMergeSha.substr(0, 9);
    }

    const jenkinsCheck = pull.checks.find((check) => check.key === 'jenkins');
    const mergeableCheck = pull.checks.find((check) => check.key === 'mergeable');
    const upToDateCheck = pull.checks.find((check) => check.key === 'uptodate');

    return (
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <div className="PullRequest">
            <h2 className="PullRequest__Title">
              <span style={{ color: '#9aa2ab' }}>#{pull.number}</span> {pull.title} <small>by {pull.owner}</small>
            </h2>
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
            <div className="row">
              <div className="col-md-6">
                <UpToDate check={upToDateCheck} />
              </div>
              <div className="col-md-6">
                <Mergeable check={mergeableCheck} />
              </div>
            </div>
            <Jenkins check={jenkinsCheck} baseUrl={jenkinsUrl} />
          </div>
        </div>
      </div>
    );
  }
});

export default PullRequest;

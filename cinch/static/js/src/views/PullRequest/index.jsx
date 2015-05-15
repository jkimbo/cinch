import React from 'react';

import Jenkins from './views/Jenkins';
import Mergeable from './views/Mergeable';
import UpToDate from './views/UpToDate';

require('css/components/PullRequest.css');


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

    const {project} = pull;
    const pullRequestUrl = `https://github.com/${project.owner}/${project.name}/pull/${pull.number}`;
    const projectUrl = `https://github.com/${project.owner}/${project.name}`;
    const headUrl = `https://github.com/${project.owner}/${project.name}/commit/${pull.head}`;

    return (
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <div className="PullRequest">
            <h2 className="PullRequest__Title">
              <a href={pullRequestUrl} style={{ color: '#9aa2ab' }}>#{pull.number}</a> {pull.title} <small>by {pull.owner}</small>
            </h2>
            <div className="row">
              <div className="col-md-12">
                <div className="PullRequest__Meta">
                  <div className="row">
                    <div className="col-md-6">
                      <a href={projectUrl} className="PullRequest__Project">
                        <i className="fa fa-github"></i> {project.owner}/{project.name}
                      </a>
                    </div>
                    <div className="col-md-6">
                      <a href={headUrl} className="PullRequest__Commit">
                        SHA: {shortHeadSha}
                      </a>
                    </div>
                  </div>
                </div>
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

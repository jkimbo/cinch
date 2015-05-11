import React from 'react';

const PullRequest = React.createClass({
  propTypes: {
    pull: React.PropTypes.object.isRequired
  },

  render() {
    const {pull} = this.props;

    const shortSha = pull.head.substr(0, 9);

    return (
      <div className="PullRequest">
        <div className="row">
          <div className="col-md-8">
            <h3 className="PullRequest__Title">
              <span style={{ color: '#9aa2ab' }}>#{pull.number}</span> {pull.title} <small>by {pull.owner}</small>
            </h3>
          </div>
          <div className="col-md-4">
            <div className="PullRequest__Meta">
              <div className="PullRequest__Commit">
                <a href="">
                  Commit: {shortSha}
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

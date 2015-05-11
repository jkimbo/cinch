/* global __BROWSER__ */
import React from 'react';

import PullRequest from './views/PullRequest';

import payload from './payload';

if (__BROWSER__) {
  React.render(
    <PullRequest {...payload} />,
    document.getElementById('app')
  );
}

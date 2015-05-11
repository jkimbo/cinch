/* global __PAYLOAD__ */

if (typeof __PAYLOAD__ === 'undefined') {
  throw new Error('JS payload not defined');
}

export default __PAYLOAD__;

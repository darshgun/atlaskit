// @flow
// TODO: Ask Marco amd MB if still needed
// Object.fromEntries polyfill, remove when upgraded to node 10
module.exports = function fromEntries(iterable /*: Array<any> */) {
  return [...iterable].reduce(
    // $FlowFixMe - no string usef for key
    (obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }),
    {},
  );
};

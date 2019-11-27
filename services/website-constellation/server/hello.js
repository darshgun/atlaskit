// @flow
exports.handler = function hello(event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: 'Hello, World',
  });
};

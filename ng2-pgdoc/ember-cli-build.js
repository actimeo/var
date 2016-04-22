/* global require, module */

var Angular2App = require('angular-cli/lib/broccoli/angular2-app');

module.exports = function(defaults) {
  var app = new Angular2App(defaults, {
      vendorNpmFiles: [ 'ng2-material/**', 'ng2-postgresql-procedures/**', 'marked/marked.min.js']
  });
  return app.toTree();
}

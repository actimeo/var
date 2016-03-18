/* global require, module */

var Angular2App = require('angular-cli/lib/broccoli/angular2-app');

module.exports = function(defaults) {
  var app = new Angular2App(defaults, {
    vendorNpmFiles: [ 'i18next/**', 'i18next-browser-languagedetector/**', 'moment/**'  ]
  });
  return app.toTree();
}

/* global require, module */

var Angular2App = require('angular-cli/lib/broccoli/angular2-app');

module.exports = function(defaults) {
  var app = new Angular2App(defaults, {
    vendorNpmFiles: [ 'i18next/**', 'i18next-xhr-backend/**', 'i18next-browser-languagedetector/**', 'moment/**', 'variation-user/**', 'ng2-i18next/**'  ]
  });
  return app.toTree();
}

/* global require, module */

var Angular2App = require('angular-cli/lib/broccoli/angular2-app');

module.exports = function (defaults) {
  return new Angular2App(defaults, {
    vendorNpmFiles: [
      'systemjs/dist/system-polyfills.js',
      'systemjs/dist/system.src.js',
      'zone.js/dist/*.js',
      'es6-shim/es6-shim.js',
      'reflect-metadata/*.js',
      'rxjs/**/*.js',
      '@angular/**/*.js',

      'ng2-bootstrap/**/*.js',
      'i18next/**/*.js',
      'i18next-xhr-backend/**/*.js',
      'i18next-browser-languagedetector/**/*.js',
      'moment/**/*.js',
      'ng2-i18next/**',
      'variation-toolkit/**/*.js',
      'ng2-postgresql-procedures/**/*.js'
    ]
  });
};

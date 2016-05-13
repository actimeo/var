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

      'ng2-bootstrap/**',
      'i18next/**',
      'i18next-xhr-backend/**',
      'i18next-browser-languagedetector/**',
      'moment/**',
      'ng2-i18next/**',
      'variation-toolkit/**',
      'ng2-postgresql-procedures/**'
    ]
  });
};

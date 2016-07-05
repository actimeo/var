// SystemJS configuration file, see links for more information
// https://github.com/systemjs/systemjs
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md

/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
  'ng2-i18next': 'vendor/ng2-i18next',
  'i18next': 'vendor/i18next/i18next.min.js',
  'i18nextXHRBackend': 'vendor/i18next-xhr-backend/i18nextXHRBackend.min.js',
  'i18nextBrowserLanguageDetector': 'vendor/i18next-browser-languagedetector/i18nextBrowserLanguageDetector.min.js',
  'ng2-postgresql-procedures': 'vendor/ng2-postgresql-procedures',
  'primeng': 'vendor/primeng',
  'primeuiNgAll': 'vendor/primeui/primeui-ng-all.min.js',
  '@angular2-material': 'vendor/@angular2-material'
};

/** User packages configuration. */
const packages: any = {
  'vendor/ng2-i18next': {
    format: 'cjs',
    defaultExtension: 'js'
  },
  'i18next': { format: 'global' },
  'i18nextXHRBackend': { format: 'global' },
  'i18nextBrowserLanguageDetector': { format: 'global' },
  'vendor/ng2-postgresql-procedures': {
    format: 'cjs',
    defaultExtension: 'js'
  },
  'primeng': {
    defaultExtension: 'js'
  },
  'primeuiNgAll': { format: 'global' },
};

// put the names of any of your Material components here
const materialPkgs:string[] = [
  'core',
  'sidenav'
];

materialPkgs.forEach((pkg) => {
  packages[`@angular2-material/${pkg}`] = {main: `${pkg}.js`};
});

////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/forms',
  '@angular/http',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',

  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'app',
  'app/shared',
  'app/login',
  'app/home',
  'app/organization',
  'app/organization-select',
  'app/organization-main',
  'app/groups-list',
  'app/group-topics',
  'app/topic-select',
  'app/group-edit',
  'app/dlg-inputtext',
  'app/dlg-selecttopic',
  'app/home-system',
  'app/home-organizations',
  'app/home-portals',
  /** @cli-barrel */
];

const cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  cliSystemConfigPackages[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js'
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({ map, packages });

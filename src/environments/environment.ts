// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appBaseUrl: "http://localhost:3001/api",
  appBaseUrlMedia: "http://localhost:3001/uploads",
  configFile: "assets/settings/settings.json",
  // ... otras variables que ya tengas
  WARNING_TIME_BEFORE_EXPIRATION_MINUTES: 1, // Valor para desarrollo
  LOGOUT_AFTER_WARNING_MINUTES: 1,
  TOKEN_REFRESH_BUFFER_SECONDS: 15,
  TOKEN_KEY: 'jwt_token',
  REFRESH_TOKEN_DATA_KEY: 'refresh_token_data',
  apiUrl: 'http://localhost:3001/api', // Ejemplo, ajusta tu URL de API
  apiLogin: 'http://localhost:3001' 
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

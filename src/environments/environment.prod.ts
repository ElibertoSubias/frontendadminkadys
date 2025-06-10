export const environment = {
  production: true,
  appBaseUrl: "https://backendkadys.elisodevelopment.cloud/api",
  appBaseUrlMedia: "https://backendkadys.elisodevelopment.cloud/uploads",
  configFile: "assets/settings/settings.json",
  // ... otras variables que ya tengas
  WARNING_TIME_BEFORE_EXPIRATION_MINUTES: 1, // Valor para desarrollo d
  LOGOUT_AFTER_WARNING_MINUTES: 1,
  TOKEN_REFRESH_BUFFER_SECONDS: 15,
  TOKEN_KEY: 'jwt_token',
  REFRESH_TOKEN_DATA_KEY: 'refresh_token_data',
  apiUrl: 'https://backendkadys.elisodevelopment.cloud/api', // Ejemplo, ajusta tu URL de API
  apiLogin: 'https://backendkadys.elisodevelopment.cloud' 
};

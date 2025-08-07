import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {AuthInterceptor, ErrorInterceptor, LoggingInterceptor, WarningInterceptor} from './interceptors/interceptors';
import {providePetStoreJsonClient} from './clients/json-pet-store-client/generated';
import {providePetStoreYamlClient} from './clients/yaml-pet-store-client/generated';
import {providePetStoreUrlClient} from './clients/url-pet-store-client/generated';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    providePetStoreJsonClient({
      basePath: 'https://petstore3.swagger.io/api/v3',
      interceptors: [ErrorInterceptor, AuthInterceptor, LoggingInterceptor, WarningInterceptor]
    }),
    providePetStoreUrlClient({
      basePath: 'https://petstore3.swagger.io/api/v3',
      interceptors: [ErrorInterceptor, AuthInterceptor, LoggingInterceptor]
    }),
    providePetStoreYamlClient({
      basePath: 'https://petstore3.swagger.io/api/v3',
      interceptors: [WarningInterceptor, LoggingInterceptor]
    }),
  ]
};

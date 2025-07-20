import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {AuthInterceptor, ErrorInterceptor, LoggingInterceptor, WarningInterceptor} from './interceptors/interceptors';
import {providePetStoreClient} from './clients/pet-store-client/generated';
import {provideSecondPetStoreClient} from './clients/second-pet-store-client/generated';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    providePetStoreClient({
      basePath: 'https://petstore3.swagger.io/api/v3',
      interceptors: [ErrorInterceptor, AuthInterceptor, LoggingInterceptor, WarningInterceptor]
    }),
    provideSecondPetStoreClient({
      basePath: 'https://petstore3.swagger.io/api/v3',
      interceptors: [WarningInterceptor, LoggingInterceptor]
    }),
  ]
};

import { InjectionToken } from "@angular/core";
import { HttpInterceptor, HttpContextToken } from "@angular/common/http";

/**
 * Injection token for the PetStoreJson client base API path
 */
export const BASE_PATH_PETSTOREJSON = new InjectionToken<string>('BASE_PATH_PETSTOREJSON', {
      providedIn: 'root',
      factory: () => '/api', // Default fallback
    });
/**
 * Injection token for the PetStoreJson client HTTP interceptor instances
 */
export const HTTP_INTERCEPTORS_PETSTOREJSON = new InjectionToken<HttpInterceptor[]>('HTTP_INTERCEPTORS_PETSTOREJSON', {
      providedIn: 'root',
      factory: () => [], // Default empty array
    });
/**
 * HttpContext token to identify requests belonging to the PetStoreJson client
 */
export const CLIENT_CONTEXT_TOKEN_PETSTOREJSON = new HttpContextToken<string>(() => 'PetStoreJson');

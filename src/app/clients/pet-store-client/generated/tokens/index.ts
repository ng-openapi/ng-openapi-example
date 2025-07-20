import { InjectionToken } from "@angular/core";
import { HttpInterceptor, HttpContextToken } from "@angular/common/http";

/**
 * Injection token for the PetStore client base API path
 */
export const BASE_PATH_PETSTORE = new InjectionToken<string>('BASE_PATH_PETSTORE', {
      providedIn: 'root',
      factory: () => '/api', // Default fallback
    });
/**
 * Injection token for the PetStore client HTTP interceptor instances
 */
export const HTTP_INTERCEPTORS_PETSTORE = new InjectionToken<HttpInterceptor[]>('HTTP_INTERCEPTORS_PETSTORE', {
      providedIn: 'root',
      factory: () => [], // Default empty array
    });
/**
 * HttpContext token to identify requests belonging to the PetStore client
 */
export const CLIENT_CONTEXT_TOKEN_PETSTORE = new HttpContextToken<string>(() => 'PetStore');

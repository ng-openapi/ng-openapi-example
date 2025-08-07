import { InjectionToken } from "@angular/core";
import { HttpInterceptor, HttpContextToken } from "@angular/common/http";

/**
 * Injection token for the PetStoreUrl client base API path
 */
export const BASE_PATH_PETSTOREURL = new InjectionToken<string>('BASE_PATH_PETSTOREURL', {
      providedIn: 'root',
      factory: () => '/api', // Default fallback
    });
/**
 * Injection token for the PetStoreUrl client HTTP interceptor instances
 */
export const HTTP_INTERCEPTORS_PETSTOREURL = new InjectionToken<HttpInterceptor[]>('HTTP_INTERCEPTORS_PETSTOREURL', {
      providedIn: 'root',
      factory: () => [], // Default empty array
    });
/**
 * HttpContext token to identify requests belonging to the PetStoreUrl client
 */
export const CLIENT_CONTEXT_TOKEN_PETSTOREURL = new HttpContextToken<string>(() => 'PetStoreUrl');

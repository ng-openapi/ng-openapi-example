import { InjectionToken } from "@angular/core";
import { HttpInterceptor, HttpContextToken } from "@angular/common/http";

/**
 * Injection token for the SecondPetStore client base API path
 */
export const BASE_PATH_SECONDPETSTORE = new InjectionToken<string>('BASE_PATH_SECONDPETSTORE', {
      providedIn: 'root',
      factory: () => '/api', // Default fallback
    });
/**
 * Injection token for the SecondPetStore client HTTP interceptor instances
 */
export const HTTP_INTERCEPTORS_SECONDPETSTORE = new InjectionToken<HttpInterceptor[]>('HTTP_INTERCEPTORS_SECONDPETSTORE', {
      providedIn: 'root',
      factory: () => [], // Default empty array
    });
/**
 * HttpContext token to identify requests belonging to the SecondPetStore client
 */
export const CLIENT_CONTEXT_TOKEN_SECONDPETSTORE = new HttpContextToken<string>(() => 'SecondPetStore');

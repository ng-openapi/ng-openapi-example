import { InjectionToken } from "@angular/core";
import { HttpInterceptor, HttpContextToken } from "@angular/common/http";

/**
 * Injection token for the PetStoreYaml client base API path
 */
export const BASE_PATH_PETSTOREYAML = new InjectionToken<string>('BASE_PATH_PETSTOREYAML', {
      providedIn: 'root',
      factory: () => '/api', // Default fallback
    });
/**
 * Injection token for the PetStoreYaml client HTTP interceptor instances
 */
export const HTTP_INTERCEPTORS_PETSTOREYAML = new InjectionToken<HttpInterceptor[]>('HTTP_INTERCEPTORS_PETSTOREYAML', {
      providedIn: 'root',
      factory: () => [], // Default empty array
    });
/**
 * HttpContext token to identify requests belonging to the PetStoreYaml client
 */
export const CLIENT_CONTEXT_TOKEN_PETSTOREYAML = new HttpContextToken<string>(() => 'PetStoreYaml');

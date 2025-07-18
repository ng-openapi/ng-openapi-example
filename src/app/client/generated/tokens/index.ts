import { InjectionToken } from "@angular/core";

/**
 * Injection token for the base API path
 */
export const BASE_PATH = new InjectionToken<string>('BASE_PATH', {
      providedIn: 'root',
      factory: () => '/api', // Default fallback
    });

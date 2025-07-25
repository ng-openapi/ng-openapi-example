/* @ts-nocheck */
/* eslint-disable */
/* @noformat */
/* @formatter:off */
/**
* Generated by ng-openapi
* Generated provider functions for easy setup
* Do not edit this file manually
*/
import { EnvironmentProviders, Provider, makeEnvironmentProviders } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpInterceptor } from "@angular/common/http";
import { BASE_PATH_PETSTORE, HTTP_INTERCEPTORS_PETSTORE } from "./tokens";
import { PetStoreBaseInterceptor } from "./utils/base-interceptor";
import { DateInterceptor } from "./utils/date-transformer";

/** Configuration options for PetStore client */
export interface PetStoreConfig {
    /** Base API URL */
    basePath: string;
    /** Enable automatic date transformation (default: true) */
    enableDateTransform?: boolean;
    /** Array of HTTP interceptor classes to apply to this client */
    interceptors?: (new (...args: HttpInterceptor[]) => HttpInterceptor)[];
}

/** Provides configuration for PetStore client */
/** */
/** @example */
/** ```typescript */
/** // In your app.config.ts */
/** import { providePetStoreClient } from './api/providers'; */
/** */
/** export const appConfig: ApplicationConfig = { */
/**   providers: [ */
/**     providePetStoreClient({ */
/**       basePath: 'https://api.example.com', */
/**       interceptors: [AuthInterceptor, LoggingInterceptor] // Classes, not instances */
/**     }), */
/**     // other providers... */
/**   ] */
/** }; */
/** ``` */
export function providePetStoreClient(config: PetStoreConfig): EnvironmentProviders {

    const providers: Provider[] = [
        // Base path token for this client
        {
            provide: BASE_PATH_PETSTORE,
            useValue: config.basePath
        },
        // Base interceptor that handles client-specific interceptors
        {
            provide: HTTP_INTERCEPTORS,
            useClass: PetStoreBaseInterceptor,
            multi: true
        }
    ];

    // Add client-specific interceptor instances
    if (config.interceptors && config.interceptors.length > 0) {
        const interceptorInstances = config.interceptors.map(InterceptorClass => new InterceptorClass());
        
        // Add date interceptor if enabled (default: true)
        if (config.enableDateTransform !== false) {
            interceptorInstances.unshift(new DateInterceptor());
        }
        
        providers.push({
            provide: HTTP_INTERCEPTORS_PETSTORE,
            useValue: interceptorInstances
        });
    } else if (config.enableDateTransform !== false) {
        // Only date interceptor enabled
        providers.push({
            provide: HTTP_INTERCEPTORS_PETSTORE,
            useValue: [new DateInterceptor()]
        });
    } else {
        // No interceptors
        providers.push({
            provide: HTTP_INTERCEPTORS_PETSTORE,
            useValue: []
        });
    }

    return makeEnvironmentProviders(providers);
}

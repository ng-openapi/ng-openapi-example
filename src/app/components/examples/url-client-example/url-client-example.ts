import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {PetService} from '../../../clients/url-pet-store-client/generated';

/**
 * URL client: HTTP-level generator options against the remote spec.
 *
 * - `customHeaders` adds `api_key` to every request of this client.
 * - `emitAcceptHeader` sends `Accept: application/json`, derived from the spec.
 * - `responseTypeMapping` pins Angular's `responseType` per content type.
 * - `validateInput` guards generation against an unexpected remote document.
 */
@Component({
  selector: 'app-url-client-example',
  templateUrl: './url-client-example.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UrlClientExample {
  readonly #petService = inject(PetService);

  /** `observe: 'response'` returns the whole `HttpResponse`, not only the body. */
  readonly response = rxResource({
    stream: () => this.#petService.findPetsByStatus('sold', 'response'),
  });

  /** `value()` throws while the resource is in the error state, so guard with `hasValue()`. */
  readonly soldCount = computed(() =>
    this.response.hasValue() ? (this.response.value().body?.length ?? 0) : 0,
  );

  readonly responseHeaders = computed(() => {
    if (!this.response.hasValue()) {
      return [];
    }
    const headers = this.response.value().headers;
    return headers.keys().map((name) => ({name, value: headers.get(name) ?? ''}));
  });

  /** Headers the generated client adds on its own; check the Network tab to see them go out. */
  readonly requestHeaders = [
    {name: 'api_key', value: 'special-key', source: 'customHeaders'},
    {name: 'Accept', value: 'application/json', source: 'emitAcceptHeader'},
  ];
}

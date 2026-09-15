import {ChangeDetectionStrategy, Component, computed, inject, signal, untracked} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {rxResource} from '@angular/core/rxjs-interop';
import {
  findPetsByStatus200Response,
  findPetsByStatus200ResponseItem,
  getPetById200Response,
  Pet,
  PetResource,
  PetService,
} from '../../../clients/json-pet-store-client/generated';

export type PetStatus = NonNullable<Pet['status']>;

/**
 * JSON client: runtime validation with Zod.
 *
 * The generated `validators/` folder (from `ZodPlugin`) exports one schema per operation.
 * `validation.response` adds a `parse` hook to every service method, and `httpResource`
 * supports `parse` natively, so the same schema validates both call styles.
 */
@Component({
  selector: 'app-json-client-example',
  imports: [JsonPipe],
  templateUrl: './json-client-example.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class JsonClientExample {
  readonly #petResource = inject(PetResource);
  readonly #petService = inject(PetService);

  readonly statuses: readonly PetStatus[] = ['available', 'pending', 'sold'];
  readonly status = signal<PetStatus>('available');
  readonly selectedPetId = signal<number | undefined>(undefined);

  /**
   * Strict mode validates the whole list with `findPetsByStatus200Response`; one bad pet
   * rejects the response. Lenient mode validates each pet with the generated
   * `findPetsByStatus200ResponseItem` schema and drops the ones that fail.
   * The public Pet Store contains malformed entries, so lenient is the default.
   */
  readonly strict = signal(false);
  readonly rejectedCount = signal(0);

  /** Re-fetches whenever `status` changes. Every response body is validated by Zod. */
  readonly pets = this.#petResource.findPetsByStatus(this.status, {
    defaultValue: [],
    parse: (body) => this.#parsePets(body),
  });

  /** `value()` throws while the resource is in the error state, so guard with `hasValue()`. */
  readonly limitedPets = computed(() => (this.pets.hasValue() ? this.pets.value().slice(0, 6) : []));

  /** Classic `HttpClient` service call; `parse` comes from `validation.response`. */
  readonly selectedPet = rxResource({
    params: () => this.selectedPetId(),
    stream: ({params: petId}) =>
      this.#petService.getPetById(petId, undefined, {parse: getPetById200Response.parse}),
  });

  onStatusChange(event: Event) {
    this.status.set((event.target as HTMLSelectElement).value as PetStatus);
  }

  onStrictChange(event: Event) {
    this.strict.set((event.target as HTMLInputElement).checked);
    this.pets.reload();
  }

  #parsePets(body: unknown): Pet[] {
    // `parse` runs outside any reactive context; `untracked` makes that explicit.
    if (untracked(this.strict)) {
      this.rejectedCount.set(0);
      return findPetsByStatus200Response.parse(body);
    }

    const items = Array.isArray(body) ? body : [];
    const results = items.map((item) => findPetsByStatus200ResponseItem.safeParse(item));
    this.rejectedCount.set(results.filter((r) => !r.success).length);
    return results.flatMap((r) => (r.success ? [r.data] : []));
  }
}

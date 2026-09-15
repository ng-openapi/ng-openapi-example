import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {
  ApiPetService,
  ApiUserResource,
  GetPetByIdParams,
} from '../../../clients/yaml-pet-store-client/generated';

/**
 * YAML client: ergonomics options.
 *
 * - `useSingleRequestParameter`: methods take one typed request object (`GetPetByIdParams`).
 * - `serviceDecorator: 'service'`: generated classes use Angular 22's `@Service()`.
 * - `naming`: services/resources are prefixed with `Api`, models are suffixed with `Dto`.
 */
@Component({
  selector: 'app-yaml-client-example',
  templateUrl: './yaml-client-example.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class YamlClientExample {
  readonly #petService = inject(ApiPetService);
  readonly #userResource = inject(ApiUserResource);

  readonly petId = signal(1);
  readonly username = signal('user1');

  /** One request object per call instead of positional parameters. */
  readonly pet = rxResource({
    params: (): GetPetByIdParams => ({petId: this.petId()}),
    stream: ({params}) => this.#petService.getPetById(params),
  });

  /**
   * Resource classes carry the `Api` prefix from `naming.resources` and return `UserDto`.
   * Passing the signal itself makes the resource re-fetch whenever the username changes.
   */
  readonly user = this.#userResource.getUserByName(this.username);

  loadPet(rawId: string) {
    const id = Number(rawId);
    if (Number.isInteger(id) && id > 0) {
      this.petId.set(id);
    }
  }

  loadUser(rawName: string) {
    const name = rawName.trim();
    if (name.length > 0) {
      this.username.set(name);
    }
  }
}

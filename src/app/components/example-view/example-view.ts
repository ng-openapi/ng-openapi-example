import {Component, inject, computed} from '@angular/core';
import {PetService} from '../../clients/pet-store-client/generated';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-example-view',
  imports: [],
  templateUrl: './example-view.html',
  styleUrl: './example-view.css'
})
export class ExampleView {
  readonly #petService = inject(PetService);
  readonly availablePets = toSignal(this.#petService.findPetsByStatus("available"));

  // Computed signal to get only first 5 pets
  readonly limitedPets = computed(() => {
    const pets = this.availablePets();
    return pets ? pets.slice(0, 5) : [];
  });
}

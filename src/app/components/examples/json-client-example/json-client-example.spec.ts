import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {JsonClientExample} from './json-client-example';
import {providePetStoreJsonClient} from '../../../clients/json-pet-store-client/generated';

const BASE_PATH = 'http://test/api';

describe('JsonClientExample', () => {
  let fixture: ComponentFixture<JsonClientExample>;
  let component: JsonClientExample;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonClientExample],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        providePetStoreJsonClient({basePath: BASE_PATH}),
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(JsonClientExample);
    component = fixture.componentInstance;
    TestBed.tick();
  });

  afterEach(() => httpTesting.verify());

  it('loads pets for the selected status through the httpResource', async () => {
    const req = httpTesting.expectOne(
      (r) => r.url === `${BASE_PATH}/pet/findByStatus` && r.params.get('status') === 'available',
    );
    expect(req.request.headers.get('Accept')).toBe('application/json');

    req.flush([{id: 1, name: 'Rex', photoUrls: [], status: 'available'}]);
    await fixture.whenStable();

    expect(component.pets.status()).toBe('resolved');
    expect(component.limitedPets().map((p) => p.name)).toEqual(['Rex']);
  });

  it('drops malformed pets in lenient mode using the per-item Zod schema', async () => {
    const req = httpTesting.expectOne((r) => r.url === `${BASE_PATH}/pet/findByStatus`);

    // `name` and `photoUrls` are required by the generated schema; the first item is invalid.
    req.flush([{id: 1}, {id: 2, name: 'Rex', photoUrls: []}]);
    await fixture.whenStable();

    expect(component.pets.status()).toBe('resolved');
    expect(component.rejectedCount()).toBe(1);
    expect(component.limitedPets().map((p) => p.id)).toEqual([2]);
  });

  it('puts the resource into the error state when strict mode rejects the response', async () => {
    component.strict.set(true);
    const req = httpTesting.expectOne((r) => r.url === `${BASE_PATH}/pet/findByStatus`);

    req.flush([{id: 1}, {id: 2, name: 'Rex', photoUrls: []}]);
    await fixture.whenStable();

    expect(component.pets.status()).toBe('error');
    expect(component.pets.error()?.message).toContain('photoUrls');
    expect(component.pets.hasValue()).toBeFalse();
    // The template reads limitedPets() unconditionally, so it must not throw in the error state.
    expect(component.limitedPets()).toEqual([]);
  });

  it('reloads the resource when strict mode is toggled', async () => {
    httpTesting.expectOne((r) => r.url === `${BASE_PATH}/pet/findByStatus`).flush([]);
    await fixture.whenStable();

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    component.onStrictChange({target: checkbox} as unknown as Event);
    TestBed.tick();

    expect(component.strict()).toBeTrue();
    httpTesting.expectOne((r) => r.url === `${BASE_PATH}/pet/findByStatus`).flush([]);
    await fixture.whenStable();
    expect(component.pets.status()).toBe('resolved');
  });

  it('re-fetches when the status signal changes', async () => {
    httpTesting.expectOne((r) => r.params.get('status') === 'available').flush([]);
    await fixture.whenStable();

    component.status.set('sold');
    TestBed.tick();

    httpTesting.expectOne((r) => r.params.get('status') === 'sold').flush([]);
    await fixture.whenStable();
    expect(component.pets.status()).toBe('resolved');
  });

  it('loads the selected pet through PetService with the Zod parse hook', async () => {
    httpTesting.expectOne((r) => r.url === `${BASE_PATH}/pet/findByStatus`).flush([]);
    await fixture.whenStable();

    component.selectedPetId.set(7);
    TestBed.tick();

    httpTesting.expectOne(`${BASE_PATH}/pet/7`).flush({id: 7, name: 'Milo', photoUrls: ['a.jpg']});
    await fixture.whenStable();

    expect(component.selectedPet.value()?.name).toBe('Milo');
  });

  it('surfaces a Zod error on the selected pet when the body is invalid', async () => {
    httpTesting.expectOne((r) => r.url === `${BASE_PATH}/pet/findByStatus`).flush([]);
    await fixture.whenStable();

    component.selectedPetId.set(8);
    TestBed.tick();

    httpTesting.expectOne(`${BASE_PATH}/pet/8`).flush({id: 8});
    await fixture.whenStable();

    expect(component.selectedPet.status()).toBe('error');
  });
});

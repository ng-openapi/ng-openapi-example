import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {YamlClientExample} from './yaml-client-example';
import {ApiPetService, providePetStoreYamlClient} from '../../../clients/yaml-pet-store-client/generated';

const BASE_PATH = 'http://test/api';

describe('YamlClientExample', () => {
  let fixture: ComponentFixture<YamlClientExample>;
  let component: YamlClientExample;
  let httpTesting: HttpTestingController;

  const flushInitialRequests = () => {
    httpTesting.expectOne(`${BASE_PATH}/user/user1`).flush({id: 1, username: 'user1', firstName: 'Ada'});
    httpTesting.expectOne(`${BASE_PATH}/pet/1`).flush({id: 1, name: 'Rex', photoUrls: []});
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YamlClientExample],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        providePetStoreYamlClient({basePath: BASE_PATH}),
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(YamlClientExample);
    component = fixture.componentInstance;
    TestBed.tick();
  });

  afterEach(() => httpTesting.verify());

  it('provides the @Service()-decorated ApiPetService in the root injector', () => {
    flushInitialRequests();
    expect(TestBed.inject(ApiPetService)).toBeInstanceOf(ApiPetService);
  });

  it('loads the pet by id using a single request object', async () => {
    flushInitialRequests();
    await fixture.whenStable();

    expect(component.pet.value()?.name).toBe('Rex');

    component.loadPet('42');
    TestBed.tick();

    httpTesting.expectOne(`${BASE_PATH}/pet/42`).flush({id: 42, name: 'Milo', photoUrls: []});
    await fixture.whenStable();
    expect(component.pet.value()?.id).toBe(42);
  });

  it('ignores invalid pet ids', async () => {
    flushInitialRequests();
    await fixture.whenStable();

    component.loadPet('abc');
    component.loadPet('-3');
    TestBed.tick();

    expect(component.petId()).toBe(1);
    httpTesting.expectNone((r) => r.url.startsWith(`${BASE_PATH}/pet/`));
  });

  it('re-fetches the user resource when the username signal changes', async () => {
    flushInitialRequests();
    await fixture.whenStable();

    expect(component.user.value()?.firstName).toBe('Ada');

    component.loadUser('  user2 ');
    TestBed.tick();

    httpTesting.expectOne(`${BASE_PATH}/user/user2`).flush({id: 2, username: 'user2', firstName: 'Grace'});
    await fixture.whenStable();

    expect(component.username()).toBe('user2');
    expect(component.user.value()?.firstName).toBe('Grace');
  });

  it('ignores blank usernames', async () => {
    flushInitialRequests();
    await fixture.whenStable();

    component.loadUser('   ');
    TestBed.tick();

    expect(component.username()).toBe('user1');
    httpTesting.expectNone((r) => r.url.startsWith(`${BASE_PATH}/user/`));
  });
});

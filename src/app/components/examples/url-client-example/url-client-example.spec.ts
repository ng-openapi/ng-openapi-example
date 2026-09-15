import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {UrlClientExample} from './url-client-example';
import {providePetStoreUrlClient} from '../../../clients/url-pet-store-client/generated';

const BASE_PATH = 'http://test/api';

describe('UrlClientExample', () => {
  let fixture: ComponentFixture<UrlClientExample>;
  let component: UrlClientExample;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlClientExample],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        providePetStoreUrlClient({basePath: BASE_PATH}),
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(UrlClientExample);
    component = fixture.componentInstance;
    TestBed.tick();
  });

  afterEach(() => httpTesting.verify());

  it('sends the api_key and Accept headers configured in the generator', async () => {
    const req = httpTesting.expectOne(
      (r) => r.url === `${BASE_PATH}/pet/findByStatus` && r.params.get('status') === 'sold',
    );

    expect(req.request.headers.get('api_key')).toBe('special-key');
    expect(req.request.headers.get('Accept')).toBe('application/json');

    req.flush([{id: 1, name: 'Rex', photoUrls: []}], {headers: {'x-demo': 'yes'}});
    await fixture.whenStable();

    expect(component.response.value()?.status).toBe(200);
    expect(component.soldCount()).toBe(1);
    expect(component.responseHeaders()).toContain({name: 'x-demo', value: 'yes'});
  });
});

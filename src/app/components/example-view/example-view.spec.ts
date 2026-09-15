import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ExampleView} from './example-view';

describe('ExampleView', () => {
  let component: ExampleView;
  let fixture: ComponentFixture<ExampleView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleView],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleView);
    component = fixture.componentInstance;
    TestBed.tick();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders all three client examples', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-json-client-example')).not.toBeNull();
    expect(el.querySelector('app-yaml-client-example')).not.toBeNull();
    expect(el.querySelector('app-url-client-example')).not.toBeNull();
  });
});

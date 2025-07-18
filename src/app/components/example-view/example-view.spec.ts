import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleView } from './example-view';

describe('ExampleView', () => {
  let component: ExampleView;
  let fixture: ComponentFixture<ExampleView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExampleView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

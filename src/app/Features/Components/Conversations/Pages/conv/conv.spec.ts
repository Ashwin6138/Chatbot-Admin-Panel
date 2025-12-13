import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Conv } from './conv';

describe('Conv', () => {
  let component: Conv;
  let fixture: ComponentFixture<Conv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Conv]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Conv);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

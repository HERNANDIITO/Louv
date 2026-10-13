import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GemasMetalesComponent } from './gemas-metales.component';

describe('GemasMetalesComponent', () => {
  let component: GemasMetalesComponent;
  let fixture: ComponentFixture<GemasMetalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GemasMetalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GemasMetalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

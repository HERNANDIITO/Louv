import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxMatCardComponent } from './box-mat-card.component';

describe('BoxMatCardComponent', () => {
  let component: BoxMatCardComponent;
  let fixture: ComponentFixture<BoxMatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxMatCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxMatCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

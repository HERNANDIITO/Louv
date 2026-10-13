import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasesEngastesComponent } from './bases-engastes.component';

describe('BasesEngastesComponent', () => {
  let component: BasesEngastesComponent;
  let fixture: ComponentFixture<BasesEngastesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasesEngastesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasesEngastesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

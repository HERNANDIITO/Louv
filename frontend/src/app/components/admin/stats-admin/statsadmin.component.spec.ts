import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsadminComponent } from './statsadmin.component';

describe('StatsadminComponent', () => {
  let component: StatsadminComponent;
  let fixture: ComponentFixture<StatsadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

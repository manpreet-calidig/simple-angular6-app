import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveguidelinesComponent } from './leaveguidelines.component';

describe('LeaveguidelinesComponent', () => {
  let component: LeaveguidelinesComponent;
  let fixture: ComponentFixture<LeaveguidelinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveguidelinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveguidelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

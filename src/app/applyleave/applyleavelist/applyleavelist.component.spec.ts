import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyleavelistComponent } from './applyleavelist.component';

describe('ApplyleavelistComponent', () => {
  let component: ApplyleavelistComponent;
  let fixture: ComponentFixture<ApplyleavelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyleavelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyleavelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

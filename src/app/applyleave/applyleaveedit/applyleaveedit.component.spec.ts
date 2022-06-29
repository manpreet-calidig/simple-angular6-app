import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyleaveeditComponent } from './applyleaveedit.component';

describe('ApplyleaveeditComponent', () => {
  let component: ApplyleaveeditComponent;
  let fixture: ComponentFixture<ApplyleaveeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyleaveeditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyleaveeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

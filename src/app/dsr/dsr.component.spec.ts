import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsrComponent } from './dsr.component';

describe('DsrComponent', () => {
  let component: DsrComponent;
  let fixture: ComponentFixture<DsrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DsrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditoverviewComponent } from './editoverview.component';

describe('EditoverviewComponent', () => {
  let component: EditoverviewComponent;
  let fixture: ComponentFixture<EditoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditoverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

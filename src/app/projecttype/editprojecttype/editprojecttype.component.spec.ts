import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditprojecttypeComponent } from './editprojecttype.component';

describe('EditprojecttypeComponent', () => {
  let component: EditprojecttypeComponent;
  let fixture: ComponentFixture<EditprojecttypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditprojecttypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditprojecttypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

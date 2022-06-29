import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListprojecttypeComponent } from './listprojecttype.component';

describe('ListprojecttypeComponent', () => {
  let component: ListprojecttypeComponent;
  let fixture: ComponentFixture<ListprojecttypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListprojecttypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListprojecttypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjecttypeComponent } from './projecttype.component';

describe('ProjecttypeComponent', () => {
  let component: ProjecttypeComponent;
  let fixture: ComponentFixture<ProjecttypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjecttypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjecttypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

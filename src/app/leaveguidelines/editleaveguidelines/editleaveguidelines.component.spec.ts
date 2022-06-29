import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditleaveguidelinesComponent } from './editleaveguidelines.component';

describe('EditleaveguidelinesComponent', () => {
  let component: EditleaveguidelinesComponent;
  let fixture: ComponentFixture<EditleaveguidelinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditleaveguidelinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditleaveguidelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

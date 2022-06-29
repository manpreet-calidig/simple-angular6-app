import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditleavetypeComponent } from './editleavetype.component';

describe('EditleavetypeComponent', () => {
  let component: EditleavetypeComponent;
  let fixture: ComponentFixture<EditleavetypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditleavetypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditleavetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditdsrComponent } from './editdsr.component';

describe('EditdsrComponent', () => {
  let component: EditdsrComponent;
  let fixture: ComponentFixture<EditdsrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditdsrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditdsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

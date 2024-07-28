import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMechanicComponent } from './add-mechanic.component';

describe('AddMechanicComponent', () => {
  let component: AddMechanicComponent;
  let fixture: ComponentFixture<AddMechanicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMechanicComponent]
    });
    fixture = TestBed.createComponent(AddMechanicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

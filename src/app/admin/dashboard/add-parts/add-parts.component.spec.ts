import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPartsComponent } from './add-parts.component';

describe('AddPartsComponent', () => {
  let component: AddPartsComponent;
  let fixture: ComponentFixture<AddPartsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPartsComponent]
    });
    fixture = TestBed.createComponent(AddPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

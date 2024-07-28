import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDealerComponent } from './add-dealer.component';

describe('AddDealerComponent', () => {
  let component: AddDealerComponent;
  let fixture: ComponentFixture<AddDealerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDealerComponent]
    });
    fixture = TestBed.createComponent(AddDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

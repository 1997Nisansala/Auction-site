import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminItemListComponent } from './admin-item-list.component';

describe('AdminItemListComponent', () => {
  let component: AdminItemListComponent;
  let fixture: ComponentFixture<AdminItemListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminItemListComponent]
    });
    fixture = TestBed.createComponent(AdminItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserRatingComponent } from './admin-user-rating.component';

describe('AdminUserRatingComponent', () => {
  let component: AdminUserRatingComponent;
  let fixture: ComponentFixture<AdminUserRatingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminUserRatingComponent]
    });
    fixture = TestBed.createComponent(AdminUserRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

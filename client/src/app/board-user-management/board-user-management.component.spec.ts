import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardUserMangementComponent } from './board-user-management.component';

describe('BoardUserComponent', () => {
  let component: BoardUserMangementComponent;
  let fixture: ComponentFixture<BoardUserMangementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardUserMangementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardUserMangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardContributions } from './board-contributions.component';

describe('BoardContributions', () => {
  let component: BoardContributions;
  let fixture: ComponentFixture<BoardContributions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardContributions ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardContributions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

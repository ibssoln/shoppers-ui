import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqBoardComponent } from './faq-board.component';

describe('FaqBoardComponent', () => {
  let component: FaqBoardComponent;
  let fixture: ComponentFixture<FaqBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

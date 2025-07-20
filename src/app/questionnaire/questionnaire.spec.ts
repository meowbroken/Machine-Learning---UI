import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Questionnaire } from './questionnaire';

describe('Questionnaire', () => {
  let component: Questionnaire;
  let fixture: ComponentFixture<Questionnaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Questionnaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Questionnaire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

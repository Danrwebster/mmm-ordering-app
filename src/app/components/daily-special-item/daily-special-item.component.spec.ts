import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailySpecialItemComponent } from './daily-special-item.component';

describe('DailySpecialItemComponent', () => {
	let component: DailySpecialItemComponent;
	let fixture: ComponentFixture<DailySpecialItemComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DailySpecialItemComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DailySpecialItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

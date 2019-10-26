import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemModifierListComponent } from './item-modifier-list.component';

describe('ItemModifierListComponent', () => {
	let component: ItemModifierListComponent;
	let fixture: ComponentFixture<ItemModifierListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ItemModifierListComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ItemModifierListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

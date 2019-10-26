import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCategoryPageComponent } from './menu-category-page.component';

describe('ItemListPageComponent', () => {
	let component: MenuCategoryPageComponent;
	let fixture: ComponentFixture<MenuCategoryPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MenuCategoryPageComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MenuCategoryPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

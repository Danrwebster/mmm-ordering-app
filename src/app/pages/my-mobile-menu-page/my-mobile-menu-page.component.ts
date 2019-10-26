import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { IMenuItemDetails, IMenuDetails } from '@models/menu.model';
import { MenuService } from '@services/menu.service';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'app-my-mobile-menu-page',
	templateUrl: './my-mobile-menu-page.component.html',
	styleUrls: ['./my-mobile-menu-page.component.scss']
})
export class MyMobileMenuPageComponent implements OnInit, OnDestroy {

	public selectedItem: IMenuItemDetails;
	private _menu: IMenuDetails;
	private _subscription = new Subscription;

	constructor(
		private _menuService: MenuService,
		private _router: Router,
		private _route: ActivatedRoute
	) { }

	ngOnInit() {
		this._menu = this._route.snapshot.data.menuCategories.body;
		const routeSub = this._router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(() => {
				this._menu = this._route.snapshot.data.menuCategories.body;
			});
		this._subscription.add(routeSub);
	}

	ngOnDestroy() {
		this._subscription.unsubscribe();
	}

	public get menuTitle(): string {
		return this._menu.title;
	}

	public get menu(): IMenuDetails {
		return this._menu;
	}

	public get imageURL(): string {
		return 'url("' + this._menu.imageURL + '")';
	}

	public showItem(sku: string) {
		this._menuService.lookupItem(sku);
	}

}

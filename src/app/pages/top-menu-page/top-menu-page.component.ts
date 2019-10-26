import { Component, OnInit, OnDestroy } from '@angular/core';
import { IMenu } from '@models/menu.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuService } from '@services/menu.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-top-menu-page',
	templateUrl: './top-menu-page.component.html',
	styleUrls: ['./top-menu-page.component.scss']
})

export class TopMenuPageComponent implements OnInit, OnDestroy {

	private _menu: IMenu[];
	private _subscription = new Subscription();

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _menuService: MenuService
	) { }

	ngOnInit() {
		this._menu = this._route.snapshot.data.topMenu.body;
		this._menuService.setTopMenu(this._menu);

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

	public get menuList(): IMenu[] {
		return this._menu;
	}

	public imageURL(url: string): string {
		return 'url("' + url + '")';
	}
}

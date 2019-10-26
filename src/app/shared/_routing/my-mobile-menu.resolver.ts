import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MenuService } from '@services/menu.service';
import { IMenu, ICategory } from '@models/menu.model';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class MyMobileMenuResolver implements Resolve<HttpResponse<ICategory>> {
	constructor(
		private _menuService: MenuService
	) { }

	resolve(route: ActivatedRouteSnapshot) {
		return this._menuService.getMyMobileMenu('mmm');
	}
}

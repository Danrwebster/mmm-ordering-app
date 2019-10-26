import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { MenuService } from '@services/menu.service';
import { ICategory } from '@models/menu.model';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class MenuCategoryResolver implements Resolve<HttpResponse<ICategory>> {
	constructor(
		private _menuService: MenuService
	) { }

	resolve(route: ActivatedRouteSnapshot) {
		const category = route.paramMap.get('id');
		if (category) {
			return this._menuService.getCategoryMenu(category);
		} else {
			return of(null);
		}
	}
}

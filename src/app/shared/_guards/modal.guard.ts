import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MenuService } from '@services/menu.service';

@Injectable({ providedIn: 'root' })
export class ModalGuard implements CanActivate {
	constructor(
		private _menuService: MenuService
	) { }

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): boolean {
		if (this._menuService.showModal) {
			this._menuService.showModal = false;
			return false;
		} else {
			return true;
		}
	}
}

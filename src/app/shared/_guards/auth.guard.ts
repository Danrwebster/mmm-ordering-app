import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
	constructor(
		private _router: Router,
		private _authenticationService: AuthenticationService
	) { }

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> {
		return this._authenticationService.isAuthenticated()
			.pipe(
				tap(loggedIn => {
					if (!loggedIn) {
						this._router.navigate(['/login'], {
							queryParams: {
								return: state.url
							}
						});
					}
				})
			);
	}
}

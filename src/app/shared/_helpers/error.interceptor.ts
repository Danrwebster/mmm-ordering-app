import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '@services/authentication.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(
		private _authenticationService: AuthenticationService,
		private _router: Router) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(catchError(err => {
			if (err.status === 401) {
				// auto logout if 401 response returned from api
				this._authenticationService.signOut();
				this._router.navigateByUrl('/login');
			}

			const error = err.error.message || err.statusText;
			return throwError(error);
		}));
	}
}

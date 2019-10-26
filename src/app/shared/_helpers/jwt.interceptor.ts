import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

	constructor(private _authenticationService: AuthenticationService) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		const accessToken = this._authenticationService.getAccessToken();

		if (accessToken) {
			const headers = request.headers
				.set('Content-Type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`);

			request = request.clone({ headers });
			return next.handle(request);
		} else {
			// Send request without adding token to header
			return next.handle(request);
		}
	}
}

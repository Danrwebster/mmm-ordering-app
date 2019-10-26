import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap, catchError } from 'rxjs/operators';
import { of, Observable, BehaviorSubject, from } from 'rxjs';
import Amplify, { Auth } from 'aws-amplify';
import { AWS_REGION, AWS_USER_POOL_ID, AWS_USER_POOL_WEB_CLIENT_ID } from '@configs/cognito.config';

class MyStorage {
	static syncPromise = null;

	static parseKey(key: string): string {
		switch (key.split('.').length) {
			case 4:
				return key.split('.')[2] + '.' + key.split('.')[3];
				break;
			case 3:
				return key.split('.')[2];
				break;
			default:
				return key;
		}
	}

	static setItem(key: string, value: string): string {
		const newKey = this.parseKey(key);
		localStorage.setItem(newKey, value);
		return localStorage.getItem(newKey);
	}

	static getItem(key: string): string {
		const newKey = this.parseKey(key);
		return localStorage.getItem(newKey);
	}

	static removeItem(key: string): void {
		const newKey = this.parseKey(key);
		localStorage.removeItem(newKey);
	}

	static clear(): void {
		localStorage.clear();
	}
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

	public loggedIn$ = new BehaviorSubject<boolean>(false);

	constructor(
		private router: Router
	) {
		Amplify.configure({
			Auth: {
				// REQUIRED - Amazon Cognito Region
				region: AWS_REGION,

				// OPTIONAL - Sets custom storage options for tokens
				storage: MyStorage,

				// OPTIONAL - Amazon Cognito User Pool ID
				userPoolId: AWS_USER_POOL_ID,

				// OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
				userPoolWebClientId: AWS_USER_POOL_WEB_CLIENT_ID,

				// OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
				mandatorySignIn: false,
			}
		});
	}

	/** signup */
	public signUp(userName: string, password: string): Observable<any> {
		return from(Auth.signUp(userName, password));
	}

	/** confirm code */
	public confirmSignUp(userName: string, code: string): Observable<any> {
		return from(Auth.confirmSignUp(userName, code));
	}

	/** signin */
	public signIn(userName: string, password: string): Observable<any> {
		return from(Auth.signIn(userName, password))
			.pipe(
				tap(() => this.loggedIn$.next(true)),
				catchError(error => {
					this.loggedIn$.next(false);
					return of({ error: error });
				})
			);
	}

	/** get authenticat state */
	public isAuthenticated(): Observable<boolean> {
		return from(Auth.currentAuthenticatedUser())
			.pipe(
				map(result => {
					this.loggedIn$.next(true);
					return true;
				}),
				catchError(error => {
					this.loggedIn$.next(false);
					return of(false);
				})
			);
	}

	/** signout */
	public signOut() {
		from(Auth.signOut())
			.subscribe(
				result => {
					this.loggedIn$.next(false);
					this.router.navigate(['/topMenu']);
				},
				error => console.log(error)
			);
	}

	public getAccessToken(): string {
		const accessToken = MyStorage.getItem(`${MyStorage.getItem('LastAuthUser')}` + '.accessToken');
		return accessToken;
	}
}

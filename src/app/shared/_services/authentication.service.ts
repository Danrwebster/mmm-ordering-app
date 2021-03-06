import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap, catchError } from 'rxjs/operators';
import { of, Observable, BehaviorSubject, from, Subject } from 'rxjs';
import Amplify, { Auth } from 'aws-amplify';
import { AWS_REGION, AWS_USER_POOL_ID, AWS_USER_POOL_WEB_CLIENT_ID, AWS_IDENTITY_POOL } from '@configs/cognito.config';
import { eFormType } from '../constants';
import { ICredentials } from '@aws-amplify/core';

class MyStorage {
	static syncPromise = null;

	static parseKey(key: string): string {
		switch (key.split('.').length) {
			case 4:
				return key.split('.')[2] + '.' + key.split('.')[3];
			case 3:
				return key.split('.')[2];
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

	private _loginFormState: eFormType = eFormType.LOGIN;
	private _guestCredentials: ICredentials = null;

	public $guestCredentials = new Subject<ICredentials>();
	public loggedIn$ = new BehaviorSubject<boolean>(false);

	constructor(
		private router: Router
	) {
		Amplify.configure({
			Auth: {
				// REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
				identityPoolId: AWS_IDENTITY_POOL,

				// REQUIRED - Amazon Cognito Region
				region: AWS_REGION,

				// OPTIONAL - Amazon Cognito Federated Identity Pool Region
				// Required only if it's different from Amazon Cognito Region
				identityPoolRegion: AWS_REGION,

				// OPTIONAL - Amazon Cognito User Pool ID
				userPoolId: AWS_USER_POOL_ID,

				// OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
				userPoolWebClientId: AWS_USER_POOL_WEB_CLIENT_ID,

				// OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
				mandatorySignIn: false,

				// OPTIONAL - Sets custom storage options for tokens
				storage: MyStorage,
			}
		});
	}

	// guest access request
	public guestAccess(): Observable<any> {
		return from(Auth.currentCredentials())
			.pipe(
				catchError(error => {
					return of({ error: error });
				})
			);
	}

	// set guest credentials
	public setGuestCredentials(credentials: ICredentials) {
		this._guestCredentials = credentials;
		this.$guestCredentials.next(this._guestCredentials);
	}

	// signup
	public signUp(firstName: string, lastName: string, password: string, email: string, phone?: string): Observable<any> {
		const signUpBlob = {
			'username': email,
			'password': password,
			'attributes': {
				'email': email,
				'given_name': firstName,
				'family_name': lastName,
			}
		};

		if (phone) {
			signUpBlob.attributes['phone_number'] = phone;
		}

		return from(Auth.signUp(signUpBlob))
			.pipe(
				catchError(error => {
					return of({ error: error });
				})
			);
	}

	// confirm code
	public confirmSignUp(userName: string, code: string): Observable<any> {
		return from(Auth.confirmSignUp(userName, code))
			.pipe(
				catchError(error => {
					return of({ error: error });
				})
			);
	}

	// resend confirm signup code
	public resendConfirmSignUp(userName: string): Observable<any> {
		return from(Auth.resendSignUp(userName))
			.pipe(
				catchError(error => {
					return of({ error: error });
				})
			);
	}

	// signin
	public signIn(userName: string, password: string): Observable<any> {
		return from(Auth.signIn(userName, password))
			.pipe(
				tap(() => {
					this.loggedIn$.next(true);
					this._guestCredentials = null;
					this.$guestCredentials.next(this._guestCredentials);
				}),
				catchError(error => {
					this.loggedIn$.next(false);
					return of({ error: error });
				})
			);
	}

	// forgot password - request reset
	public forgotPassword(userName: string): Observable<any> {
		return from(Auth.forgotPassword(userName))
			.pipe(
				catchError(error => {
					return of({ error: error });
				})
			);
	}

	// reset password with reset code
	public forgotPasswordSubmit(userName: string, resetCode: string, newPassword: string): Observable<any> {
		return from(Auth.forgotPasswordSubmit(userName, resetCode, newPassword))
			.pipe(
				catchError(error => {
					return of({ error: error });
				})
			);
	}

	// get authenticated state
	public isAuthenticated(): Observable<boolean> {
		return from(Auth.currentAuthenticatedUser())
			.pipe(
				map(() => {
					this.loggedIn$.next(true);
					return true;
				}),
				catchError(() => {
					this.loggedIn$.next(false);
					return of(false);
				})
			);
	}

	public isGuest(): boolean {
		return this._guestCredentials !== null;
	}

	/** signout */
	public signOut() {
		from(Auth.signOut())
			.subscribe(() => {
				this.loggedIn$.next(false);
				this.router.navigate(['/login']);
			},
				error => console.log(error)
			);
	}

	public getAccessToken(): string {
		if (this._guestCredentials) {
			return this._guestCredentials.sessionToken;
		} else {
			const accessToken = MyStorage.getItem(`${MyStorage.getItem('LastAuthUser')}` + '.accessToken');
			return accessToken;
		}
	}

	public get loginFormState(): eFormType {
		return this._loginFormState;
	}

	public set loginFormState(value: eFormType) {
		this._loginFormState = value;
	}

	public resetLoginFormState() {
		this._loginFormState = eFormType.LOGIN;
	}
}

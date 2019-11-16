import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';
import { eFormType } from 'src/app/shared/constants';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-login-page',
	templateUrl: './login-page.component.html',
	styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

	constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		private _authenticationService: AuthenticationService
	) { }

	private _return = '';

	// public usernameAttributes = 'phone_number';
	public usernameAttributes = 'email';

	public signUpConfig = {
		header: 'Create a Profile',
		hideAllDefaults: true,
		defaultCountryCode: '1',
		signUpFields: [
			{
				label: 'First Name',
				key: 'given_name',
				required: true,
				displayOrder: 1,
				type: 'string',
			},
			{
				label: 'Last name',
				key: 'family_name',
				required: true,
				displayOrder: 2,
				type: 'string',
			},
			{
				label: 'Password',
				key: 'password',
				required: true,
				displayOrder: 3,
				type: 'password',
			},
			{
				label: 'Email',
				key: 'email',
				required: false,
				displayOrder: 4,
				type: 'email',
			},
			{
				label: 'Phone Number',
				key: 'phone_number',
				required: false,
				displayOrder: 5,
				type: 'string',
			}
		]
	};

	ngOnInit() {
		this._route.queryParams.subscribe(params => this._return = params['return'] || '/topMenu');
	}

	onLogin() {
		this._router.navigateByUrl(this._return);
	}

	public canDeactivate(): Observable<boolean> | boolean {
		if (this._authenticationService.loginFormState !== eFormType.LOGIN) {
			this._authenticationService.resetLoginFormState();
			return false;
		} else {
			return true;
		}
	}

}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-login-page',
	templateUrl: './login-page.component.html',
	styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

	constructor(
		private router: Router,
		private route: ActivatedRoute
	) { }

	private _return = '';

	public signUpConfig = {
		header: 'Create a Profile',
		hideAllDefaults: true,
		signUpFields: [
			{
				label: 'Username',
				key: 'username',
				required: true,
				displayOrder: 1,
				type: 'string',
			},
			{
				label: 'Password',
				key: 'password',
				required: true,
				displayOrder: 2,
				type: 'password',
			},
			{
				label: 'Email',
				key: 'email',
				required: true,
				displayOrder: 3,
				type: 'email',
			},
			{
				label: 'First Name',
				key: 'given_name',
				required: true,
				displayOrder: 4,
				type: 'string',
			},
			{
				label: 'Last name',
				key: 'family_name',
				required: true,
				displayOrder: 5,
				type: 'string',
			}
		]
	};

	ngOnInit() {
		this.route.queryParams.subscribe(params => this._return = params['return'] || '/topMenu');
	}

	onLogin() {
		this.router.navigateByUrl(this._return);
	}

}

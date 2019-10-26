import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '@services/authentication.service';

@Component({
	selector: 'app-login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

	@Output() login = new EventEmitter<boolean>();

	public loginForm: FormGroup;
	private _hide: boolean = true;
	private _loading: boolean;

	constructor(
		private _authenticationService: AuthenticationService,
		private _formBuilder: FormBuilder
	) {}

	ngOnInit() {
		this.loginForm = this._formBuilder.group({
			userName: ['', Validators.required],
			password: ['', Validators.required]
		});
		this._loading = false;
	}

	public get hide(): boolean {
		return this._hide;
	}

	public set hide(value: boolean) {
		this._hide = value;
	}

	public get loading(): boolean {
		return this._loading;
	}

	public signIn(): void {
		this._loading = true;
		this._authenticationService.signIn(this.loginForm.controls.userName.value, this.loginForm.controls.password.value)
			.subscribe(value => {
				console.log('VALUE: ', value);

				if (value.error) {
					switch (value.error.code) {
						case 'UserNotFoundException':
							this.loginForm.controls.userName.setErrors({ 'incorrect': true });
							this._loading = false;
							break;
						case 'NotAuthorizedException':
							this.loginForm.controls.password.setErrors({ 'incorrect': true });
							this._loading = false;
							break;
						case 'PasswordResetRequiredException':
						case 'UserNotConfirmedException':
							break;
						default:
					}
				} else {
					if (value.challengeName) {
						switch (value.challengeName) {
							case 'SMS_MFA':
							case 'SOFTWARE_TOKEN_MFA':
								// You need to get the code from the UI inputs
								// and then trigger the following function with a button click
								// If MFA is enabled, sign-in should be confirmed with the confirmation code
								// const loggedUser = await Auth.confirmSignIn(
								// 	user,   // Return object from Auth.signIn()
								// 	code,   // Confirmation code from user input
								// 	mfaType // MFA Type e.g. SMS, TOTP.
								// );
								break;
							case 'NEW_PASSWORD_REQUIRED':
								// const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
								// You need to get the new password and required attributes from the UI inputs
								// and then trigger the following function with a button click
								// For example, the email and phone_number are required attributes
								// const { username, email, phone_number } = getInfoFromUserInput();
								// const loggedUser = await Auth.completeNewPassword(
								// 	user,               // the Cognito User Object
								// 	newPassword,       // the new password
								// 	// OPTIONAL, the required attributes
								// 	{
								// 		email,
								// 		phone_number,
								// 	}
								// );
								break;
							case 'MFA_SETUP':
								// This happens when the MFA method is TOTP
								// The user needs to setup the TOTP before using it
								// More info please check the Enabling MFA part
								// Auth.setupTOTP(user);
								break;
						}
					} else {
						this.login.emit(true);
					}
				}
			});
	}

	public enableSignIn(): boolean {
		return this.loginForm.controls.userName.valid && this.loginForm.controls.password.valid;
	}

	public get passwordInvalid(): boolean {
		if (this.loginForm.controls.password.errors) {
			return this.loginForm.controls.password.errors.incorrect ? this.loginForm.controls.password.errors.incorrect : false;
		} else {
			return false;
		}
	}

	public get userNameInvalid(): boolean {
		if (this.loginForm.controls.userName.errors) {
			return this.loginForm.controls.userName.errors.incorrect ? this.loginForm.controls.userName.errors.incorrect : false;
		} else {
			return false;
		}
	}

	public clearError(targetForm: string): void {
		switch (targetForm) {
			case 'password':
				this.loginForm.controls.password.setErrors(null);
				break;
			case 'userName':
				this.loginForm.controls.userName.setErrors(null);
				break;
			default:
		}
	}

}

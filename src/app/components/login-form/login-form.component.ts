import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '@services/authentication.service';
import { eFormType } from 'src/app/shared/constants';
import { ICodeDeliveryDetails } from '@models/authentication.model';

@Component({
	selector: 'app-login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

	@Output() login = new EventEmitter<boolean>();

	public loginForm: FormGroup;
	public signUpForm: FormGroup;
	public passwordForm: FormGroup;
	public passwordResetForm: FormGroup;
	public confirmForm: FormGroup;
	private _hide: boolean = true;
	private _loading: boolean;
	private _codeDelivery = <ICodeDeliveryDetails>{
		AttributeName: '',
		DeliveryMedium: '',
		Destination: ''
	};

	public formTypes = eFormType;

	constructor(
		private _authenticationService: AuthenticationService,
		private _formBuilder: FormBuilder
	) { }

	ngOnInit() {
		this._authenticationService.resetLoginFormState();

		this.loginForm = this._formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required]
		});

		this.signUpForm = this._formBuilder.group({
			given_name: ['', Validators.required],
			family_name: ['', Validators.required],
			password: ['', Validators.compose(
				[Validators.required, Validators.minLength(8)])], // NEED PASSWORD VALIDATOR (length > 7, uppercase > 0, lowercase > 0, special > 0)
			email: ['', Validators.required, Validators.email], // NEED EMAIL VALIDATOR
			phone_number: ['', Validators.required] // NEED PHONE NUMBER VALIDATOR
		});

		this.passwordForm = this._formBuilder.group({
			email: ['', Validators.compose(
				[Validators.required, Validators.email])]
		});

		this.passwordResetForm = this._formBuilder.group({
			username: ['', Validators.required],
			code: ['', Validators.required],
			password: ['', Validators.compose(
				[Validators.required, Validators.minLength(8)])] // NEED PASSWORD VALIDATOR (length > 7, uppercase > 0, lowercase > 0, special > 0)
		});

		this.confirmForm = this._formBuilder.group({
			username: [''], // NEED TO AUTO-FILL WITH EMAIL ENTERED
			code: ['', Validators.required]
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
		this._authenticationService.signIn(this.loginForm.controls.username.value, this.loginForm.controls.password.value)
			.subscribe(value => {
				console.log('VALUE: ', value);

				if (value.error) {
					switch (value.error.code) {
						case 'UserNotFoundException':
							this.loginForm.controls.username.setErrors({ 'incorrect': true });
							this._loading = false;
							break;
						case 'NotAuthorizedException':
							this.loginForm.controls.password.setErrors({ 'incorrect': true });
							this._loading = false;
							break;
						case 'PasswordResetRequiredException':
							this.formType = eFormType.RESET_SUBMIT;
							break;
						case 'UserNotConfirmedException':
							break;
						default:
					}
				} else {
					if (value.challengeName) {
						switch (value.challengeName) {
							case 'SMS_MFA':
							case 'SOFTWARE_TOKEN_MFA':
								this.formType = eFormType.MFA;
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
								this.formType = eFormType.RESET_SUBMIT;
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
								this.formType = eFormType.MFA;
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
		return this.loginForm.controls.username.valid && this.loginForm.controls.password.valid;
	}

	public passwordInvalid(form: FormGroup): boolean {
		if (this.loginForm.controls.password.errors) {
			return this.loginForm.controls.password.errors.incorrect ? this.loginForm.controls.password.errors.incorrect : false;
		} else {
			return false;
		}
	}

	public get userNameInvalid(): boolean {
		if (this.loginForm.controls.username.errors) {
			return this.loginForm.controls.username.errors.incorrect ? this.loginForm.controls.username.errors.incorrect : false;
		} else {
			return false;
		}
	}

	public get codeInvalid(): boolean {
		if (this.passwordResetForm.controls.code.errors) {
			return this.passwordResetForm.controls.code.errors.incorrect ? this.passwordResetForm.controls.code.errors.incorrect : false;
		} else {
			return false;
		}
	}

	public clearError(targetForm: string): void {
		switch (targetForm) {
			case 'password':
				this.loginForm.controls.password.setErrors(null);
				break;
			case 'username':
				this.loginForm.controls.username.setErrors(null);
				break;
			default:
		}
	}

	public signUp(): void {
		this._loading = true;
		this._authenticationService.signUp(
			this.signUpForm.controls.given_name.value,
			this.signUpForm.controls.family_name.value,
			this.signUpForm.controls.password.value,
			this.signUpForm.controls.email.value,
			this.signUpForm.controls.phone_number.value)
			.subscribe(value => {
				this._loading = false;

				if (value.error) {
					console.log('ERROR!', value.error);
				} else {
					if (!value.userConfirmed) {
						this._codeDelivery.AttributeName = value.codeDeliveryDetails.AttributeName;
						this._codeDelivery.DeliveryMedium = value.codeDeliveryDetails.DeliveryMedium;
						this._codeDelivery.Destination = value.codeDeliveryDetails.Destination;
						this.formType = eFormType.CONFIRM;
					}
				}
			});
	}

	public requestReset(): void {
		this._loading = true;
		this._authenticationService.forgotPassword(this.passwordForm.controls.email.value)
			.subscribe(value => {
				console.log('VALUE: ', value); // STILL NEED PROPER SUCCESS/ERROR HANDLING
				this._loading = false;
				if (value.CodeDeliveryDetails) {
					this._codeDelivery.AttributeName = value.CodeDeliveryDetails.AttributeName;
					this._codeDelivery.DeliveryMedium = value.CodeDeliveryDetails.DeliveryMedium;
					this._codeDelivery.Destination = value.CodeDeliveryDetails.Destination;
					this.formType = eFormType.RESET_SUBMIT;
				}

				if (value.error) {
					console.log('ERROR!', value.error);
				} else {
				}
			});
	}

	public submitResetPassword(): void {
		this._loading = true;
		this._authenticationService.forgotPasswordSubmit(
			this.passwordForm.controls.email.value,
			this.passwordResetForm.controls.code.value,
			this.passwordResetForm.controls.password.value)
			.subscribe(value => {
				console.log('VALUE: ', value); // STILL NEED PROPER SUCCESS/ERROR HANDLING
				this._loading = false;
				this.backToSignIn();

				if (value.error) {
					console.log('ERROR!', value.error);
				} else {
				}
			});
	}

	public confirmSignUp(): void {
		this._loading = true;
		this._authenticationService.confirmSignUp(this.confirmForm.controls.username.value, this.confirmForm.controls.code.value)
			.subscribe(value => {
				console.log('VALUE: ', value); // STILL NEED PROPER SUCCESS/ERROR HANDLING
				this._loading = false;

				if (value.error) {
					console.log('ERROR!', value.error);
				} else {
				}
			});
	}

	public resendConfirmSignUp(): void {
		this._loading = true;
		this._authenticationService.resendConfirmSignUp(this.signUpForm.controls.email.value)
			.subscribe(value => {
				console.log('VALUE: ', value); // STILL NEED PROPER SUCCESS/ERROR HANDLING
				this._loading = false;

				if (value.error) {
					console.log('ERROR!', value.error);
				} else {
				}
			});
	}

	// NEED TO DISABLE BUTTONS FOR ALL FORMS UNTIL FORMS VALID

	public get formType(): eFormType {
		return this._authenticationService.loginFormState;
	}

	public set formType(value: eFormType) {
		this._authenticationService.loginFormState = value;
	}

	public get codeDelivery(): ICodeDeliveryDetails {
		return this._codeDelivery;
	}

	public backToSignIn(): void {
		this.resetCodeDelivery();
		this.formType = eFormType.LOGIN;
	}

	public resetCodeDelivery(): void {
		this._codeDelivery.AttributeName = '';
		this._codeDelivery.DeliveryMedium = '';
		this._codeDelivery.Destination = '';
	}

	public enableReset(): boolean {
			return this.passwordResetForm.controls.code.valid && this.passwordResetForm.controls.password.valid;
	}

}

import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '@services/authentication.service';
import { eFormType } from 'src/app/shared/constants';
import { ICodeDeliveryDetails } from '@models/authentication.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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
		private _formBuilder: FormBuilder,
		private _snackBar: MatSnackBar
	) { }

	ngOnInit() {
		this._authenticationService.resetLoginFormState();

		this.loginForm = this._formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required]
		});

		this.signUpForm = this._formBuilder.group({
			given_name: ['', Validators.compose(
				[
					Validators.required,
					Validators.pattern(/^.{1,16}$/)
				]
			)],
			family_name: ['', Validators.required],
			password: ['', Validators.compose(
				[
					Validators.required,
					Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])[A-Za-z].{7,}/)
				])
			],
			email: ['', Validators.compose(
				[
					Validators.required,
					Validators.email
				])
			],
			phone_number: ['', Validators.compose(
				[
					Validators.required,
					Validators.pattern(/^\+?(?:[0-9]?){6,14}[0-9]$/)
				])
			]
		});

		this.passwordForm = this._formBuilder.group({
			email: ['', Validators.compose(
				[Validators.required, Validators.email])]
		});

		this.passwordResetForm = this._formBuilder.group({
			username: ['', Validators.required],
			code: ['', Validators.required],
			password: ['', Validators.compose(
				[
					Validators.required,
					Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])[A-Za-z].{7,}/)
				])
			]
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

	public resetForms(): void {
		this.loginForm.reset();
		this.signUpForm.reset();
		this.passwordForm.reset();
		this.passwordResetForm.reset();
		this.confirmForm.reset();
	}

	public loginNavigate(value: eFormType) {
		switch (value) {
			case eFormType.LOGIN:
				this.resetForms();
				this.formType = eFormType.LOGIN;
				break;
			case eFormType.CONFIRM:
				this.formType = eFormType.CONFIRM;
				break;
			case eFormType.REQUEST_RESET:
				this.loginForm.reset();
				this.passwordResetForm.reset();
				this.formType = eFormType.REQUEST_RESET;
				break;
			case eFormType.RESET_SUBMIT:
				this.formType = eFormType.RESET_SUBMIT;
				break;
			case eFormType.SIGNUP:
				this.loginForm.reset();
				this.formType = eFormType.SIGNUP;
				break;
			case eFormType.SIGNED_IN:
				this.resetForms();
				this.formType = eFormType.SIGNED_IN;
				break;
			default:
		}
	}

	public signIn(): void {
		this._loading = true;
		this._authenticationService.signIn(this.loginForm.controls.username.value, this.loginForm.controls.password.value)
			.subscribe(value => {
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
							this.loginNavigate(eFormType.RESET_SUBMIT);
							break;
						default:
					}
				} else {
					if (value.challengeName) {
						switch (value.challengeName) {
							case 'NEW_PASSWORD_REQUIRED':
								this.loginNavigate(eFormType.RESET_SUBMIT);
								break;
							default:
						}
					} else {
						this.login.emit(true);
					}
				}
			});
	}

	public get enableSignIn(): boolean {
		return this.loginForm.valid && !this.loginForm.pristine;
	}

	public get enableSignUp(): boolean {
		return this.signUpForm.valid && !this.signUpForm.pristine;
	}

	public get enableResetRequest(): boolean {
		return this.passwordForm.valid && !this.passwordForm.pristine;
	}

	public get enablePasswordReset(): boolean {
		return this.passwordResetForm.valid && !this.passwordResetForm.pristine;
	}

	public passwordInvalid(form: string): boolean {
		switch (form) {
			case 'signUp':
				return this.signUpForm.controls.password.hasError('pattern');
			case 'login':
				return this.loginForm.controls.password.hasError('incorrect');
			case 'reset':
				return this.passwordResetForm.controls.password.hasError('pattern');
			default:
				return false;
		}
	}

	public get userNameInvalid(): boolean {
		return this.loginForm.controls.username.hasError('incorrect');
	}

	public get codeInvalid(): boolean {
		return this.passwordResetForm.controls.code.hasError('incorrect');
	}

	public get codeExpired(): boolean {
		return this.passwordResetForm.controls.code.hasError('expired');
	}

	public emailInvalid(form: string): boolean {
		switch (form) {
			case 'signUp':
				return this.signUpForm.controls.email.hasError('email');
			case 'taken':
				return this.signUpForm.controls.email.hasError('taken');
			case 'resetRequest':
				return this.passwordForm.controls.email.hasError('email');
			case 'notFound':
				return this.passwordForm.controls.email.hasError('notFound');
			default:
				return false;
		}
	}

	public get givenNameInvalid(): boolean {
		return this.signUpForm.controls.given_name.hasError('pattern');
	}

	public get phoneInvalid(): boolean {
		return this.signUpForm.controls.phone_number.hasError('pattern');
	}

	public clearError(targetForm: string): void {
		switch (targetForm) {
			case 'username':
				if (this.loginForm.controls.username.errors) {
					this.loginForm.controls.username.setErrors(null);
				}
				break;
			case 'passwordLogin':
				if (this.loginForm.controls.password.errors) {
					this.loginForm.controls.password.setErrors(null);
				}
				break;
			case 'email':
				if (this.passwordForm.controls.email.errors) {
					this.passwordForm.controls.email.setErrors(null);
				}
				break;
			case 'code':
				if (this.passwordResetForm.controls.code.errors) {
					this.passwordResetForm.controls.code.setErrors(null);
				}
				break;
			case 'passwordReset':
				if (this.passwordResetForm.controls.password.errors) {
					this.passwordResetForm.controls.password.setErrors(null);
				}
				break;
			case 'givenName':
				if (this.signUpForm.controls.given_name.errors) {
					this.signUpForm.controls.given_name.setErrors(null);
				}
				break;
			case 'familyName':
				if (this.signUpForm.controls.family_name.errors) {
					this.signUpForm.controls.family_name.setErrors(null);
				}
				break;
			case 'phoneNumber':
				if (this.signUpForm.controls.phone_number.errors) {
					this.signUpForm.controls.phone_number.setErrors(null);
				}
				break;
			default:
		}
	}

	public signUp(): void {
		this._loading = true;

		let phoneNumber = this.signUpForm.controls.phone_number.value;

		if (phoneNumber.charAt(0) !== '+') {
			phoneNumber = '+' + phoneNumber;
			this.signUpForm.controls.phone_number.setValue(phoneNumber);
		}

		this._authenticationService.signUp(
			this.signUpForm.controls.given_name.value,
			this.signUpForm.controls.family_name.value,
			this.signUpForm.controls.password.value,
			this.signUpForm.controls.email.value,
			this.signUpForm.controls.phone_number.value)
			.subscribe(value => {
				this._loading = false;

				if (value.error) {
					switch (value.error.code) {
						case 'UsernameExistsException':
							this.signUpForm.controls.email.setErrors({ 'taken': true });
							break;
						default:
							this._snackBar.open('Unable to Create Account', 'Service Error', {
								duration: 2000,
								verticalPosition: 'top'
							});
					}
				} else {
					if (!value.userConfirmed) {
						this._codeDelivery.AttributeName = value.codeDeliveryDetails.AttributeName;
						this._codeDelivery.DeliveryMedium = value.codeDeliveryDetails.DeliveryMedium;
						this._codeDelivery.Destination = value.codeDeliveryDetails.Destination;

						this.loginNavigate(eFormType.CONFIRM);
					}
				}
			});
	}

	public requestReset(): void {
		this._loading = true;
		this._authenticationService.forgotPassword(this.passwordForm.controls.email.value)
			.subscribe(value => {
				this._loading = false;

				if (value) {
					if (value.error) {
						switch (value.error.code) {
							case 'UserNotFoundException':
								this.passwordForm.controls.email.setErrors({ 'notFound': true });
								break;
							default:
								this._snackBar.open('Service Unavailable', 'Error', {
									duration: 2000,
									verticalPosition: 'top'
								});
						}
					} else {
						if (value.CodeDeliveryDetails) {
							this._codeDelivery.AttributeName = value.CodeDeliveryDetails.AttributeName;
							this._codeDelivery.DeliveryMedium = value.CodeDeliveryDetails.DeliveryMedium;
							this._codeDelivery.Destination = value.CodeDeliveryDetails.Destination;
							this.passwordResetForm.controls.username.setValue(this.passwordForm.controls.email.value);

							this.loginNavigate(eFormType.RESET_SUBMIT);
						}
					}
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
				this._loading = false;

				if (value) {
					if (value.error) {
						switch (value.error.code) {
							case 'CodeMismatchException':
								this.passwordResetForm.controls.code.setErrors({ 'incorrect': true });
								break;
							case 'ExpiredCodeException':
								this.passwordResetForm.controls.code.setErrors({ 'expired': true });
								break;
							default:
								this._snackBar.open('Unable to Reset Password', 'Service Error', {
									duration: 2000,
									verticalPosition: 'top'
								});
						}
					}
				} else {
					this.backToSignIn();
					this._snackBar.open('Password Reset', 'Success', {
						duration: 2000,
						verticalPosition: 'top'
					});
				}
			});
	}

	public resendConfirmSignUp(): void {
		this._loading = true;
		this._authenticationService.resendConfirmSignUp(this.signUpForm.controls.email.value)
			.subscribe(value => {
				this._loading = false;

				if (value.error) {
					this._snackBar.open('Unable to Resend Confirmation Email', 'Service Error', {
						duration: 2000,
						verticalPosition: 'top'
					});
				} else {
					this._snackBar.open('Confirmation Email', 'Sent', {
						duration: 2000,
						verticalPosition: 'top'
					});
				}
			});
	}

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
		this.loginNavigate(eFormType.LOGIN);
	}

	public resetCodeDelivery(): void {
		this._codeDelivery.AttributeName = '';
		this._codeDelivery.DeliveryMedium = '';
		this._codeDelivery.Destination = '';
	}

}

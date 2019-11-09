import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from '@routing/app-routing.module';
import { AppComponent } from './app.component';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TopMenuPageComponent } from '@pages/top-menu-page/top-menu-page.component';
import { MenuCategoryPageComponent } from '@pages/menu-category-page/menu-category-page.component';
import { ItemDetailsModalComponent } from '@components/item-details-modal/item-details-modal.component';
import { NavBarComponent } from '@components/nav-bar/nav-bar.component';
import { MenuItemComponent } from '@components/menu-item/menu-item.component';
import { MyMobileMenuPageComponent } from '@pages/my-mobile-menu-page/my-mobile-menu-page.component';
import { OrderDrawerComponent } from '@components/order-drawer/order-drawer.component';
import { LoginPageComponent } from '@pages/login-page/login-page.component';
import { ProfileSettingsPageComponent } from '@pages/profile-settings-page/profile-settings-page.component';
import { PageNotFoundPageComponent } from '@pages/page-not-found-page/page-not-found-page.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TabPageComponent } from '@pages/tab-page/tab-page.component';
import { OrderStatusPageComponent } from '@pages/order-status-page/order-status-page.component';
import { RequestServicePageComponent } from '@pages/request-service-page/request-service-page.component';
import { OrderHistoryPageComponent } from '@pages/order-history-page/order-history-page.component';
import { AboutPageComponent } from '@pages/about-page/about-page.component';
import { HelpPageComponent } from '@pages/help-page/help-page.component';
import { DailySpecialItemComponent } from '@components/daily-special-item/daily-special-item.component';
import { JwtInterceptor } from '@helpers/jwt.interceptor';
import { ErrorInterceptor } from '@helpers/error.interceptor';
import { LoginFormComponent } from '@components/login-form/login-form.component';
import { ItemModifierListComponent } from './components/item-modifier-list/item-modifier-list.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';


@NgModule({
	declarations: [
		AppComponent,
		TopMenuPageComponent,
		MenuCategoryPageComponent,
		ItemDetailsModalComponent,
		NavBarComponent,
		MenuItemComponent,
		MyMobileMenuPageComponent,
		OrderDrawerComponent,
		LoginPageComponent,
		ProfileSettingsPageComponent,
		PageNotFoundPageComponent,
		TabPageComponent,
		OrderStatusPageComponent,
		RequestServicePageComponent,
		OrderHistoryPageComponent,
		AboutPageComponent,
		HelpPageComponent,
		DailySpecialItemComponent,
		LoginFormComponent,
		ItemModifierListComponent,
		ConfirmationModalComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		FormsModule,
		AmplifyAngularModule,
		MatCheckboxModule,
		MatInputModule,
		MatRadioModule,
		MatMenuModule,
		MatSidenavModule,
		MatToolbarModule,
		MatCardModule,
		MatExpansionModule,
		MatGridListModule,
		MatListModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatBadgeModule,
		MatIconModule,
		MatProgressSpinnerModule,
		MatBottomSheetModule,
		MatSnackBarModule,
		ReactiveFormsModule,
		MatTabsModule,
		MatRippleModule
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		AmplifyService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }

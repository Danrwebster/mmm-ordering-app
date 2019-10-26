import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from '@pages/login-page/login-page.component';
import { ProfileSettingsPageComponent } from '@pages/profile-settings-page/profile-settings-page.component';
import { TopMenuPageComponent } from '@pages/top-menu-page/top-menu-page.component';
import { MenuCategoryPageComponent } from '@pages/menu-category-page/menu-category-page.component';
import { MyMobileMenuPageComponent } from '@pages/my-mobile-menu-page/my-mobile-menu-page.component';
import { PageNotFoundPageComponent } from '@pages/page-not-found-page/page-not-found-page.component';
import { MenuCategoryResolver } from './category-list.resolver';
import { TopMenuResolver } from './top-menu.resolver';
import { MyMobileMenuResolver } from './my-mobile-menu.resolver';
// import { OrderStatusPageComponent } from '@pages/order-status-page/order-status-page.component';
import { TabPageComponent } from '@pages/tab-page/tab-page.component';
import { RequestServicePageComponent } from '@pages/request-service-page/request-service-page.component';
// import { HelpPageComponent } from '@pages/help-page/help-page.component';
import { AboutPageComponent } from '@pages/about-page/about-page.component';
// import { OrderHistoryPageComponent } from '@pages/order-history-page/order-history-page.component';
import { AuthGuard } from '@guards/auth.guard';
import { ModalGuard } from '@guards/modal.guard';

const routes: Routes = [
	{
		path: 'login',
		component: LoginPageComponent,
		data: { title: 'Login' },
		canActivate: [ModalGuard]
	},
	{
		path: 'profile',
		component: ProfileSettingsPageComponent,
		data: { title: 'Profile Settings' },
		canActivate: [AuthGuard, ModalGuard]
	},
	// {
	// 	path: 'order',
	// 	component: OrderStatusPageComponent,
	// 	data: { title: 'Order Status' },
	// 	canActivate: [ModalGuard]
	// },
	// {
	// 	path: 'history',
	// 	component: OrderHistoryPageComponent,
	// 	data: { title: 'Order History' },
	// 	canActivate: [AuthGuard, ModalGuard]
	// },
	{
		path: 'tab',
		component: TabPageComponent,
		data: { title: 'Tab' },
		canActivate: [ModalGuard] // Guest Access Allowed
	},
	{
		path: 'service',
		component: RequestServicePageComponent,
		data: { title: 'Request Service' },
		canActivate: [ModalGuard] // Guest Access Allowed
	},
	// {
	// 	path: 'help',
	// 	component: HelpPageComponent,
	// 	data: { title: 'Help' },
	// 	canActivate: [AuthGuard, ModalGuard] // Guest Access Allowed
	// },
	{
		path: 'about',
		component: AboutPageComponent,
		data: { title: 'About' },
		canActivate: [ModalGuard] // Guest Access Allowed
	},
	{
		path: 'topMenu',
		component: TopMenuPageComponent,
		data: { title: 'Top Menu' },
		runGuardsAndResolvers: 'always',
		resolve: {
			topMenu: TopMenuResolver
		},
		canActivate: [ModalGuard] // Guest Access Allowed
	},
	{
		path: 'menu/:id',
		component: MenuCategoryPageComponent,
		data: { title: 'Menu Categories' },
		runGuardsAndResolvers: 'always',
		resolve: {
			menuCategories: MenuCategoryResolver
		},
		canActivate: [ModalGuard] // Guest Access Allowed
	},
	{
		path: 'myMobileMenu',
		component: MyMobileMenuPageComponent,
		data: { title: 'My Mobile Menu' },
		runGuardsAndResolvers: 'always',
		resolve: {
			menuCategories: MyMobileMenuResolver
		},
		canActivate: [AuthGuard, ModalGuard]
	},
	{
		path: '',
		redirectTo: '/login',
		pathMatch: 'full'
	},
	{ path: '**', component: PageNotFoundPageComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
	providers: [MenuCategoryResolver, TopMenuResolver, MyMobileMenuResolver]
})
export class AppRoutingModule { }

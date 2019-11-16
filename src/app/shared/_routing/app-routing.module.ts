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
import { TabPageComponent } from '@pages/tab-page/tab-page.component';
import { RequestServicePageComponent } from '@pages/request-service-page/request-service-page.component';
import { AboutPageComponent } from '@pages/about-page/about-page.component';
import { AuthGuard } from '@guards/auth.guard';
import { CanDeactivateGuard } from '@guards/can-deactivate.guard';

const routes: Routes = [
	{
		path: 'login',
		component: LoginPageComponent,
		data: { title: 'Login' },
		runGuardsAndResolvers: 'always',
		canDeactivate: [CanDeactivateGuard]
	},
	{
		path: 'profile',
		component: ProfileSettingsPageComponent,
		data: { title: 'Profile Settings' },
		runGuardsAndResolvers: 'always',
		canActivate: [AuthGuard]
	},
	{
		path: 'tab',
		component: TabPageComponent,
		data: { title: 'Tab' },
		runGuardsAndResolvers: 'always',
		// canActivate: [AuthGuard]
	},
	{
		path: 'service',
		component: RequestServicePageComponent,
		data: { title: 'Request Service' },
		runGuardsAndResolvers: 'always',
		// canActivate: [AuthGuard]
	},
	{
		path: 'about',
		component: AboutPageComponent,
		data: { title: 'About' },
		runGuardsAndResolvers: 'always',
		// canActivate: [AuthGuard]
	},
	{
		path: 'topMenu',
		component: TopMenuPageComponent,
		data: { title: 'Top Menu' },
		runGuardsAndResolvers: 'always',
		resolve: {
			topMenu: TopMenuResolver
		},
		// canActivate: [AuthGuard]
	},
	{
		path: 'menu/:id',
		component: MenuCategoryPageComponent,
		data: { title: 'Menu Categories' },
		runGuardsAndResolvers: 'always',
		resolve: {
			menuCategories: MenuCategoryResolver
		},
		canDeactivate: [CanDeactivateGuard],
		// canActivate: [AuthGuard]
	},
	{
		path: 'myMobileMenu',
		component: MyMobileMenuPageComponent,
		data: { title: 'My Mobile Menu' },
		runGuardsAndResolvers: 'always',
		resolve: {
			menuCategories: MyMobileMenuResolver
		},
		// canActivate: [AuthGuard]
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
	providers: [MenuCategoryResolver, TopMenuResolver, MyMobileMenuResolver, CanDeactivateGuard]
})
export class AppRoutingModule { }

import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SignInComponent} from './components/sign-in/sign-in.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {VerifyEmailComponent} from './components/verify-email/verify-email.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { AdminUserRatingComponent } from './components/admin-user-rating/admin-user-rating.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { UserStatisticsComponent } from './components/user-statistics/user-statistics.component';

const routes: Routes = [
  {path: '', redirectTo: '/sign-in', pathMatch: 'full'},
  {path: 'sign-in', component: SignInComponent},
  {path: 'register-user', component: SignUpComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'verify-email-address', component: VerifyEmailComponent},
  {path: 'admin-login', component: AdminLoginComponent},
  {path: 'add-item', component: AddItemComponent},
  {path: 'update-user-details', component: AdminUserRatingComponent },
  {path: 'item-details', component: ItemListComponent },
  {path: 'statistics', component: StatisticsComponent },
  {path: 'user-statistics', component: UserStatisticsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}

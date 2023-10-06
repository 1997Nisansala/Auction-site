import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import {AppComponent} from './app.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {SignInComponent} from './components/sign-in/sign-in.component';
import {AppRoutingModule} from "./app-routing.module";
import {AuthService} from "./shared/services/auth.service";
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {VerifyEmailComponent} from './components/verify-email/verify-email.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { AdminNavBarComponent } from './components/admin-nav-bar/admin-nav-bar.component';
import { AdminUserRatingComponent } from './components/admin-user-rating/admin-user-rating.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { CountdownModule } from 'ngx-countdown';
import { CountdownTimerComponent } from './countdown-timer/countdown-timer.component';
import { ItemCardComponent } from './components/item-card/item-card.component';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { LoginNavBarComponent } from './components/login-nav-bar/login-nav-bar.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { UserStatisticsComponent } from './components/user-statistics/user-statistics.component';
import { AdminItemListComponent } from './components/admin-item-list/admin-item-list.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    NavigationBarComponent,
    AdminLoginComponent,
    AddItemComponent,
    AdminNavBarComponent,
    AdminUserRatingComponent,
    ItemListComponent,
    CountdownTimerComponent,
    ItemCardComponent,
    LoginNavBarComponent,
    StatisticsComponent,
    UserStatisticsComponent,
    AdminItemListComponent,
    ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AppRoutingModule,
    CountdownModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MdbCollapseModule,
    FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, provideFirebaseApp(() => initializeApp(environment.firebase)), provideDatabase(() => getDatabase())
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

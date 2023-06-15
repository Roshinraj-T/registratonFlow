import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import { CreateUserComponent } from './create-user/create-user.component';
import { GetpassComponent } from './getpass/getpass.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { VerifyComponent } from './verify/verify.component';
import { LoginComponent } from './login/login.component';
import { ForgotpassComponent } from './forgotpass/forgotpass.component';
import { VerifyForgotpassComponent } from './verify-forgotpass/verify-forgotpass.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateUserComponent,
    GetpassComponent,
    VerifyEmailComponent,
    VerifyComponent,
    LoginComponent,
    ForgotpassComponent,
    VerifyForgotpassComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

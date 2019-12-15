import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './features/enigma/views/home/home.component';
import { LoginPageComponent } from './features/authentication/views/login-page/login-page.component';
import { AuthGuard } from './features/authentication/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: LoginPageComponent },
    ],
  },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

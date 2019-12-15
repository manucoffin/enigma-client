import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  public error: boolean;
  public loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit() {}

  public onLogin(): void {
    this.authService
      .login(
        this.loginForm.controls.username.value,
        this.loginForm.controls.password.value,
      )
      .subscribe(
        res => {
          this.authService.storeToken(res);
          this.router.navigate(['/']);
        },
        error => (this.error = true),
      );
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { FormBuilder, Validators } from '@angular/forms';

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
          this.authService.storeToken(res.user);
        },
        error => (this.error = true),
      );
  }
}

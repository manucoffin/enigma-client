import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit {
  public error: boolean;
  public registerForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private authService: AuthenticationService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {}

  public onRegister(): void {
    this.authService
      .register(
        this.registerForm.controls.username.value,
        this.registerForm.controls.password.value,
      )
      .subscribe(
        res => {
          this.authService.storeToken(res.user);
        },
        error => (this.error = true),
      );
  }
}

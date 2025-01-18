import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '@models/auth.interface';
import { AuthService } from '@services/auth/auth.service';
import { FormType } from '@utils/formType';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  providers: [AuthService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  loginForm: FormGroup<FormType<Auth>>;
  error = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      token: ['', [Validators.required, Validators.minLength(1)]]
    }) as FormGroup<FormType<Auth>>;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      try {
        const token = this.loginForm.controls.token.value;
        this.authService.login(token);
        this.router.navigate(['/products']);
      } catch (error) {
        this.error.set('Invalid token');
      }
    }
  }
}

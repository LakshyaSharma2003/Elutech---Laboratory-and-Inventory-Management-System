import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {

  step: 'email' | 'reset' = 'email';

  emailForm!: FormGroup;
  resetForm!: FormGroup;

  loading = false;
  devOtp = '';   // shown on screen since SMTP isn't configured
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  sendOtp() {
    if (this.emailForm.invalid) return;
    this.loading = true;
    this.error = '';
    this.devOtp = '';
    const email = this.emailForm.value.email;

    this.api.post('Auth/forgot-password', { email }).subscribe({
      next: () => {
        // OTP generated in DB. Fetch it for dev since SMTP isn't configured.
        this.api.get<{ otp: string }>(`Auth/dev-otp/${email}`).subscribe({
          next: (res) => {
            this.devOtp = res.otp;
            this.resetForm.patchValue({ email, otp: res.otp });
          },
          error: () => {} // dev endpoint may not exist in production
        });
        this.loading = false;
        this.success = 'OTP generated. See below (dev mode — configure SMTP for real email).';
        this.step = 'reset';
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'User not found. Check the email address.';
      }
    });
  }

  resetPassword() {
    if (this.resetForm.invalid) return;
    this.loading = true;
    this.error = '';
    const { email, otp, newPassword } = this.resetForm.value;
    this.api.post('Auth/reset-password', { email, otp, newPassword }).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Password reset successfully! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Invalid or expired OTP.';
      }
    });
  }
}

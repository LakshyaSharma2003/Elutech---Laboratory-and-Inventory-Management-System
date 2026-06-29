import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './otp.html',
  styleUrl: './otp.css'
})
export class Otp implements OnInit {

  form!: FormGroup;
  loading = false;
  fetching = false;
  devOtp = '';
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Pre-fill email from query param if navigated from registration
    const email = this.route.snapshot.queryParamMap.get('email');
    if (email) {
      this.form.patchValue({ email });
      this.fetchDevOtp(email);
    }
  }

  fetchDevOtp(email: string) {
    if (!email) return;
    this.fetching = true;
    this.api.get<{ otp: string }>(`Auth/dev-otp/${email}`).subscribe({
      next: (res) => {
        this.devOtp = res.otp;
        this.form.patchValue({ otp: res.otp });
        this.fetching = false;
      },
      error: () => { this.fetching = false; }
    });
  }

  lookupOtp() {
    const email = this.form.value.email;
    if (!email) return;
    this.fetchDevOtp(email);
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { email, otp } = this.form.value;
    this.api.post('Auth/verify-otp', { email, otp }).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'OTP Verified! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Invalid or expired OTP. Try again.';
      }
    });
  }
}

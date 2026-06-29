import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  form!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.auth.login(this.form.value.email, this.form.value.password).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.auth.saveUser(res);
        const role = this.auth.role();
        if (role === 'Manager')       { this.router.navigate(['/manager']);  return; }
        if (role === 'FinanceOfficer'){ this.router.navigate(['/finance']);  return; }
        if (role === 'Employee')      { this.router.navigate(['/employee']); return; }
        this.error = `Unknown role "${role}". Contact your administrator.`;
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || err?.error || '';
        if (err?.status === 0 || err?.status === 503)
          this.error = 'Cannot reach server. Make sure the backend is running.';
        else if (err?.status === 500)
          this.error = 'Server error. Please try again in a moment.';
        else if (msg)
          this.error = msg;
        else
          this.error = 'Incorrect email or password. Please try again.';
      }
    });
  }
}

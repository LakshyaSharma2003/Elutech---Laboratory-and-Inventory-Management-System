import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // Don't attach token to auth endpoints
  const isAuthEndpoint = req.url.includes('/Auth/login') ||
                         req.url.includes('/Auth/forgot-password') ||
                         req.url.includes('/Auth/reset-password') ||
                         req.url.includes('/Auth/verify-otp') ||
                         req.url.includes('/Auth/dev-otp');

  if (token && !isAuthEndpoint) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // If 401 on a protected endpoint, token is expired — clear and redirect to login
      if (err.status === 401 && !isAuthEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};

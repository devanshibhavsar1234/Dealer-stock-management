import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  email: string = '';
  password: string = '';
  user: any;

  validateForm: FormGroup;
  loginError: string | null = null; // Add a property to hold login error messages

  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private router: Router) {
    // Clear any existing authentication data to ensure a clean login state
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('roles');
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^\S*$/)]]
    });
  }

  async login() {
    if (this.validateForm.valid) {
      this.email = this.validateForm.value.email;
      this.password = this.validateForm.value.password;
  
      try {
        this.user = await this.auth.login(this.email, this.password);
  
        if (this.user.role === 'Admin') {
          localStorage.setItem('roles', 'admin');
          this.router.navigate(['/admin']); // Redirect to admin dashboard
        } else {
          localStorage.setItem('roles', 'dealer');
          this.router.navigate(['/dealer']); // Redirect to part management page
        }
      } catch (error) {
        console.error('Login error:', error);
        this.loginError = 'Login failed. Please check your credentials and try again.';
      }
    } else {
      // Mark all fields as dirty to display validation errors
      Object.values(this.validateForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
    }
  }
}

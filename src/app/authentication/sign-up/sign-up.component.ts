import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
// Update path to match your project structure

declare var bootstrap: any;

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  validateForm: FormGroup;
  email: string = '';
  password: string = '';
  toastMessage: string = '';

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^\S*$/)]]
    });
  }

  register() {
    if (this.validateForm.valid) {
      this.email = this.validateForm.value.email;
      this.password = this.validateForm.value.password;

      // Call AuthService register method
      this.authService.register(this.email, this.password)
        .then((user: User) => {
          console.log('Registration successful:', user);
          this.showToastAndNavigate('Registration done!', '/sign-in');
        })
        .catch((error) => {
          console.error('Error registering user:', error);
          this.showToast('Error registering user!');
        });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
    }
  }

  showToast(message: string): void {
    this.toastMessage = message;
    const toastEl = document.getElementById('toastNotification');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }

  showToastAndNavigate(message: string, route: string): void {
    this.showToast(message);
    setTimeout(() => {
      this.router.navigate([route]);
    }, 2600); 
  }
}

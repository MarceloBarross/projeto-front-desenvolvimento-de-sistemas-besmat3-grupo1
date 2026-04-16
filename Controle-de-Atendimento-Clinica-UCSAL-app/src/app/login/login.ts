import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { LoginService } from './service/login.service';
import { MessageModule } from 'primeng/message';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [ButtonModule, ReactiveFormsModule, CardModule, InputTextModule, PasswordModule, MessageModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true,
})
export class Login implements OnInit {

  private fb = inject(NonNullableFormBuilder);

  errMessage: string = '';
  loading: boolean = false;

  constructor(private loginService: LoginService, private authService: AuthService,
     private cdr: ChangeDetectorRef, private router: Router ){}

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.loginForm.invalid) return;
   
    this.loading = true;
    const { email, password }  = this.loginForm.getRawValue();
    this.loginService.login(email, password)
    .pipe(
      finalize(() => {
          this.loading = false
          this.cdr.markForCheck();
      }
    ))
    .subscribe({
      next: (resp) => {
        this.authService.setSession(resp.token, resp.roles);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errMessage = 'Falha no login. Verifique suas credenciais e tente novamente.';
      }
    }) 
  }

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(() => {
      this.errMessage = '';
    })
    localStorage.clear();
  }
}

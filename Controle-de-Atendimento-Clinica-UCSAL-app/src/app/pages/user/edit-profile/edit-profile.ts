import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { UpdateUserDTO } from '../../../models/user/update-user.dto';
import { UpdatePasswordDTO } from '../../../models/user/update-password.dto';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    ButtonModule, CardModule, InputTextModule,
    PasswordModule, ReactiveFormsModule, CommonModule // 👈 CommonModule para o @if
  ],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss',
})
export class EditProfile implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  loading = false;
  role = '';

  constructor(private userService: UserService, private dtr: ChangeDetectorRef) {}

  profileForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  professionalForm = this.fb.group({
    formacao: ['', Validators.required],
    conselhoRegional: ['', Validators.required],
    especialidade: ['', Validators.required],
    diasAtendimento: ['', Validators.required],
    horariosAtendimento: ['', Validators.required],
  });

  ngOnInit() {
    this.userService.getUser().subscribe({
      next: (user) => {
        this.role = user.role;

        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
        });

        if (user.role === 'PROFISSIONAL') {
          this.professionalForm.patchValue({
            formacao: user.formacao ?? '',
            conselhoRegional: user.conselhoRegional ?? '',
            especialidade: user.especialidade ?? '',
            diasAtendimento: user.diasAtendimento ?? '',
            horariosAtendimento: user.horariosAtendimento ?? '',
          });
        }

        this.dtr.markForCheck();
      }
    });
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const updatedUser: UpdateUserDTO = { ...this.profileForm.getRawValue() };
    this.userService.updateUser(updatedUser).subscribe({
      next: (resp) => {
        console.log('Perfil atualizado', resp);
        this.dtr.markForCheck();
      },
      error: (err) => console.error(err)
    });
  }

  updatePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const novaSenha: UpdatePasswordDTO = { ...this.passwordForm.getRawValue() };
    this.userService.updatePassword(novaSenha).subscribe({
      next: () => console.log('Senha atualizada'),
      error: (err) => console.error(err)
    });
  }

  updateProfessionalInfo() {
    if (this.professionalForm.invalid) {
      this.professionalForm.markAllAsTouched();
      return;
    }

    const data = this.professionalForm.getRawValue();
    this.userService.updateUser({ ...this.profileForm.getRawValue(), ...data }).subscribe({
      next: () => console.log('Dados profissionais salvos'),
      error: (err) => console.error(err)
    });
  }
}
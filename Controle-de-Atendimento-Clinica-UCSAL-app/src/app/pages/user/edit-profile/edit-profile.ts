import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { UserService } from '../../../services/user.service';
import { UpdateUserDTO } from '../../../models/update-user.dto';
import { UpdatePasswordDTO } from '../../../models/update-password.dto';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ButtonModule, CardModule, InputTextModule, PasswordModule, ReactiveFormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss',
})
export class EditProfile  {
  private fb = inject(NonNullableFormBuilder);
  role = 'ADMIN';
  loading = false;

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

  updateProfile() {
    if (this.profileForm.valid) {
      const updatedUser: UpdateUserDTO = { ...this.profileForm.getRawValue() };

      this.userService.updateUser(updatedUser).subscribe({
        next: (resp) => {
          console.log('Perfil atualizado com sucesso', resp);
          this.dtr.markForCheck();
        },
        error: (err) => {
          console.error('Erro ao atualizar perfil', err);
          this.dtr.markForCheck();
        }
      });
    }
  }

  updatePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    if (this.passwordForm.valid) {
      const novaSenha: UpdatePasswordDTO = {...this.passwordForm.getRawValue()}

      this.userService.updatePassword(novaSenha).subscribe({
        next: () => {
          console.log('Senha atualizada com sucesso');
          this.dtr.markForCheck();
        },
        error: (err) => {
          console.error('Erro ao atualizar senha', err);
          this.dtr.markForCheck();
        }
      });
    }
  }

}

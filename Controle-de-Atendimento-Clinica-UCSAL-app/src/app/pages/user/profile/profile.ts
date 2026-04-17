import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { User } from '../../../models/user-interface';
import { UserService } from '../../../services/user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ButtonModule, CardModule, InputTextModule, PasswordModule, ReactiveFormsModule, AvatarModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})

export class Profile implements OnInit {

  constructor(private userService: UserService, private dtr: ChangeDetectorRef) {}

  errorMessage = '';

  user: User = {
    name: '',
    email: '',
    role: ''
  }


  getUser() {
    this.userService.getUser().subscribe({
      next: (resp) => {
        this.user = { ...resp };
        this.dtr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar dados do usuário';
        console.error(err);
        this.dtr.markForCheck();
      }
    })
  }

  ngOnInit() {
    this.getUser();
  }
}


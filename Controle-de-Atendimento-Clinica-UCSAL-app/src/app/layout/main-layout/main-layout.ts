import { Component, OnInit, Inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { Button, ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { MenuModule } from 'primeng/menu';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [AvatarModule, RouterOutlet, DrawerModule, ButtonModule, MenuModule, RouterModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit {

  constructor( private authService: AuthService, private router: Router) {}

  sidebarVisible: boolean = false;

  items = [
    { label: 'Opcoes', 
      items: [
        { label: 'Perfil', icon: 'pi pi-user', command: () => this.informationUser() },
        { label: 'Editar Dados', icon: 'pi pi-cog', command: () => this.editUser() },
        { label: 'Sair', icon: 'pi pi-sign-out', command: () => this.logout() }
      ]

    },  
  ]

  ngOnInit(): void {
    if (window.innerWidth > 768) {
      this.sidebarVisible = true;
    }
  }

  editUser() {
    this.router.navigate(['/main-layout/edit-profile']);
  }

  informationUser() {
      this.router.navigate(['/main-layout/profile']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


}

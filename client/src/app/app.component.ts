import { Component } from '@angular/core';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showUserManagementBoard = false;
  username?: string;

  constructor(private storageService: StorageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;
      if(this.roles.includes('ROLE_ADMIN')|| this.roles.includes('ROLE_LEADER')){
        this.showAdminBoard = true;
        if(this.roles.includes('ROLE_ADMIN')){
          this.showUserManagementBoard = true;
        }
      }
      this.username = user.username;
    }
    else{
      this.showAdminBoard = false;
      this.showUserManagementBoard = false;
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();
      },
      error: err => {
        console.log(err);
      }
    });
    
    window.location.reload();
  }
}

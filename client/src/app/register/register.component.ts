import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null,
    role:'student'
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  forCreate: boolean = false;
  forUpdate: boolean = false;
  id: any;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private storageService: StorageService, 
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.storageService.isLoggedIn())
    {
      if(this.storageService.isAdminOrLeader())
      {
        this.forCreate = true;
        if(this.id)
        {
          this.forUpdate = true;
          this.forCreate = false;
          this.userService.getUser(this.id).subscribe({
            next: data => {
              this.form.username = data.username;
              this.form.email = data.email;
              this.form.password = data.password;
              this.form.role = data.roles[0].name;
            }
          });
        }
      }
    }
  }

  updateUser(): void {
    let user = this.storageService.getUser();
    const { username, password, email, role } = this.form;
    console.log(this.form);
    this.userService.updateUser(this.id, username, email, password, role).subscribe({
      next: data => {
        var x = document.getElementById("snackbar") as HTMLElement;
        x.className = "show";
        setTimeout(() =>{ x.className = x.className.replace("show", ""); this.router.navigate(['/users']);}, 2000);
        if(user.id === this.id){
          this.storageService.clean();
          this.router.navigate(['/login']);
          window.location.replace('/login');
        }
      }
    });
  }

  onSubmit(): void {
    if(this.id)
    {
      return;
    }
    const { username, email, password,role } = this.form;
    console.log(this.form)
    this.authService.register(username, email, password, role).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        if(this.forCreate){
          this.router.navigate(['/users']);
        }
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user-management.component.html',
  styleUrls: ['./board-user-management.component.css']
})
export class BoardUserMangementComponent implements OnInit {

  displayedColumns: string[] = ['username', 'email' ,'role', 'actions'];
  dataSource = new MatTableDataSource();
  constructor(
    private userService: UserService,
    private router: Router,
    private storageService: StorageService, 
    ) { }

  deleteUser(id: any): void {
    let user = this.storageService.getUser();
    this.userService.deleteUser(id).subscribe(
      data => {
        console.log(data);
        if(user.id === id){
          this.storageService.clean();
          window.location.replace('/login');
        }
        this.ngOnInit();
      },
      err => {
        throw err;
      }
    );
  }
    //initiallizing the datasource for table rows
  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(
      data => {
        console.log(JSON.parse(data))
        this.dataSource.data = JSON.parse(data);
      },
      err => {
        throw err;
      }
    );
  }
}

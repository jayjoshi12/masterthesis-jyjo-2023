import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProcessService } from '../_services/process.service';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from '../_services/storage.service';

export interface PeriodicElement {
  name: string;
  owner: String;
  steps: number;
}

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})


export class BoardAdminComponent implements OnInit {
  
  displayedColumns: string[] = ['name', 'owner', 'steps', 'actions'];
  user: any;
  constructor(
    private processService: ProcessService,
    private storageService: StorageService
    ) { }

  //function for deleting the process depending upon the index of the process (which process is deleted)
  deleteProcess(element: any) {
    this.processService.deleteProcess(element._id).subscribe({
      next: data => {
        const index = this.dataSource.data.indexOf(element);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      },
      error: err => {
        throw new Error(err);
      }
    });
    
  }
  dataSource = new MatTableDataSource();
  
  ngOnInit(): void {
    this.user = this.storageService.getUser();
    //get all processes from database initially
    this.processService.getAllProcesses(this.user.id).subscribe({
      next: data => {
        this.dataSource.data = data;
      },
      error: err => {
        throw new Error(err);
      }
    });

    //listen to the updateDb event (every time db updated) and update the table entries
    window.addEventListener('updateDb', () => {
      this.processService.getAllProcesses(this.user.id).subscribe({
        next: data => {
          this.dataSource.data = data;
        },
        error: err => {
          throw new Error(err);
        }
      });
    });
  }
  
}

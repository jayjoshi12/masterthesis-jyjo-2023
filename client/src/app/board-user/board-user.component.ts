import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProcessService } from '../_services/process.service';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {

  displayedColumns: string[] = ['name', 'processName' ,'owner', 'deadline', 'actions'];
  dataSource = new MatTableDataSource();
  steps : any[] = [];
  user: any;
  constructor(
    private processService: ProcessService,
    private storageService: StorageService
    ) { }

    //initiallizing the datasource for table rows
  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.processService.getStepsOfUser(this.user.username).subscribe(
      data => {
        data.map((process: any, index: any) => {
          process.steps.map((step: any) => {
            step.processName = process.processName;
            if((new Date(step.stepDeadlines).getTime() < new Date().getTime()) && (step.stepCompleted === false)){
              step.overDue = true;
            }
            else{
              step.overDue = false;
            }
          });

          this.steps.push(...process.steps);
        });
        this.dataSource.data = this.steps;
      },
      err => {
        this.dataSource.data = [];
        throw err;
      }
    );
    console.log(this.steps)
  }
}

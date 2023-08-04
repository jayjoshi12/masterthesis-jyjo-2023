import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProcessService } from '../_services/process.service';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-contributions.component.html',
  styleUrls: ['./board-contributions.component.css']
})
export class BoardContributions implements OnInit {

  displayedColumns: string[] = ['name', 'processName' ,'contributor', 'deadline', 'actions'];
  dataSource = new MatTableDataSource();
  steps : any = [];
  user: any;
  stepId: any;
  processId: any;
  showInput: boolean = false;
  note: any;
  constructor(
    private processService: ProcessService,
    private storageService: StorageService
    ) { }

    show(stepId: any, processId: any){
      this.stepId = stepId;
      this.processId = processId;
      this.showInput = !this.showInput;
    }
    //checked step
    checkedStep(stepId: any, processId: any): void {
      this.processService.checkedStep(processId, stepId, this.user.username).subscribe(
        data => {
          console.log(data)
          var x = document.getElementById("snackbar2") as HTMLElement;
          x.className = "show";
          setTimeout(() =>{ x.className = x.className.replace("show", ""); window.location.reload() }, 2000);

        },
        err => {
          throw err;
        }
      );
    }

    addNote(): void {
      this.processService.addNote(this.processId, this.stepId, this.user.username, this.note).subscribe(
        data => {
          console.log(data)
          var x = document.getElementById("snackbar") as HTMLElement;
          x.className = "show";
          setTimeout(() =>{ this.note =''; this.showInput = false; x.className = x.className.replace("show", ""); }, 2000);
          
        },
        err => {
          throw err;
        }
      );
    }
    //initiallizing the datasource for table rows
  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.processService.getContributionStepsOfUser(this.user.username).subscribe(
      data => {
        data.map((process: any, index: any) => {
          process.steps.map((step: any) => {
            step.processName = process.processName;
            step.processId = process._id;
            step.stepContributors.map((contributor: any) => {
              if(contributor.name == this.user.username){
                if(contributor.checked){
                  step.checked = true;
                }
                else{
                  step.checked = false;
                }
              }
            });
            if((new Date(step.stepDeadlines).getTime() < new Date().getTime()) && (step.checked === false)){
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

import { Component, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { StorageService } from '../_services/storage.service'
import { ActivatedRoute } from '@angular/router';
import { FileUploadService } from '../_services/fileUpload.service';
import { ProcessService } from '../_services/process.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board-admin',
  templateUrl: './complete-step.component.html',
  styleUrls: ['./complete-step.component.css'],
})

export class CompleteStepComponent implements OnInit {
  
  id : any;
  user: any;

  //form controlling and databinding
  form: any = {
    processName: null,
    name: null,
    step_owner: null,
    description: null,
    deadlines: null,
    exceptionsAndAssociatedRisks: null,
    optimization: null,
    stepFiles: null,
    stepId: null,
    completed: null
  };

  //error handling
  error = {
    stepCompleted: false,
    description: false,
    exceptionsAndAssociatedRisks: false,
    optimization: false
  }

  // custom validations
  checkError(index: String): void {
    switch(index){
      case 'description':
        if(this.form.description){
          this.error.description = false;
        }
        else{
          this.error.description = true;
        }
        break;
      case 'exceptionsAndAssociatedRisks':
        if(this.form.exceptionsAndAssociatedRisks){
          this.error.exceptionsAndAssociatedRisks = false;
        }
        else{
          this.error.exceptionsAndAssociatedRisks = true;
        }
        break;
      case 'optimization':
        if(this.form.optimization){
          this.error.optimization = false;
        }
        else{
          this.error.optimization = true;
        }
        break;
    }
  }
  //array for storing the multiple files for uploading documents
  multipleFiles: any = [];
  uploadedFiles: Array<File> = [];

  // for stepper
  expandedIndex = 0;

  //selecting multiple files for uploading documents of each step
  selectMultipleFiles(event: Event){
    const element = event.currentTarget as HTMLInputElement
    if (element.files && element.files.length > 0) {
      this.multipleFiles = element.files;
    }
  }

  //for uploading documents
  onFilesSubmit(){
    const formData = new FormData();
    for(let file of this.multipleFiles){
      formData.append('file', file);
    }
    this.fileUploadService.saveFiles(formData).subscribe({
      next: data => {
          this.uploadedFiles = data;
        var x = document.getElementById("snackbar") as HTMLElement;
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
      },
      error: err => {
        throw new Error(err);
      }
    });
  }

  constructor(private storageService: StorageService, 
    private fileUploadService: FileUploadService,
    private processService: ProcessService,
    private router: Router,
    private route: ActivatedRoute
    ) { }
  
  //function for updating the field of step
  valuechange(event: Event, index: number): void {
    const element = event.currentTarget as HTMLInputElement 
    this.form.steps[index][element.name] = element.value;
  }

  //initiall assignments
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id'); //getting the id of the step
    this.user = this.storageService.getUser();  //getting the current user

    //getting the step details
    this.processService.getStepsOfUser(this.user.username).subscribe(
      data => {
        data.map((process: any) => {
          process.steps.map((step: any) => {
            if(step._id === this.id){
              this.form.processName = process.processName;
              this.form.name = step.stepName;
              this.form.description = step.stepDescription;
              this.form.exceptionsAndAssociatedRisks = step.stepExceptionsAndAssociatedRisks;
              this.form.optimization = step.stepOptimization;
              this.form.deadlines = step.stepDeadlines;
              this.form.step_owner = step.stepOwner;
              this.form.process = process._id;
            }
          });
        });
      },
      err => {
        throw err;
      }
    );
  }
  
  //function for updating step
  onCompleteStep(stepper: MatStepper):void{
    if(!(this.form.description && this.form.exceptionsAndAssociatedRisks && this.form.optimization)){
      this.error.stepCompleted = true;
      return;
    }
    else{
      this.error.stepCompleted = false;
      this.form.stepFiles = this.uploadedFiles;
      this.form.stepId = this.id;
      this.form.stepCompleted = true;
      this.processService.updateStep(this.form).subscribe(
        data => {
          var x = document.getElementById("snackbar2") as HTMLElement;
          x.className = "show";
          setTimeout(() =>{ x.className = x.className.replace("show", ""); this.router.navigate(['/steps']) }, 2000);
        },
        err => {
          throw err;
        }
      );
      
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { StorageService } from '../_services/storage.service'
import { ActivatedRoute } from '@angular/router';
import { FileUploadService } from '../_services/fileUpload.service';
import { ProcessService } from '../_services/process.service';
import { UserService } from '../_services/user.service';
import { Router } from '@angular/router';
import { isEmpty } from 'rxjs';

@Component({
  selector: 'app-board-admin',
  templateUrl: './create-process.component.html',
  styleUrls: ['./create-process.component.css'],
})

export class CreateProcessComponent implements OnInit {
  
  id : any;
  person: any;
  //form controlling and databinding
  form: any = {
    process: null,
    name: null,
    step_owner: null,
    description: null,
    deadlines: null,
    exceptionsAndAssociatedRisks: null,
    optimization: null,
    contributors: [],
  };

  contributor = 'Select a contributor';

  error = {
    process: false,
    name: false,
    description: false,
    deadlines: false,
    exceptionsAndAssociatedRisks: false,
    optimization: false
  }

  checkError(index: String): void {
    switch(index){
      case 'name':
        if(this.form.name && this.form.step_owner !== 'Select an owner' && this.form.deadlines !== '' && this.form.deadlines !== null){
          this.error.name = false;
        } else {
          this.error.name = true;
        }
        break;
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

  //addContributors
  addContributor(index: any): void {
    if(index>=0){
      this.process.steps[index].stepContributors.push({
        name: this.contributor,
        checked: false,
        notes: ''
      });
    }
    this.form.contributors.push({ name: this.contributor, checked: false, notes: []});
    this.contributor = 'Select a contributor';
  }

  addPerson(): void {
      this.process.informedPerson.push(this.person);
      console.log(this.person)
      this.person = 'Select a person';
  }

  //removeContributors
  removeContributor(index: number, contributorIndex: number): void {
    if(contributorIndex>=0){
      this.process.steps[index].stepContributors.splice(contributorIndex, 1);
    }
    this.form.contributors.splice(index, 1);
  }

  removePerson(personIndex: number): void {
    if(personIndex>=0){
      this.process.informedPerson.splice(personIndex, 1);
    }
  }
  
  //data for the user dropdown (step owner)
  users: any;

  //main process object that will be stored in database
  process = {
    processName: null,
    informedPerson: Array(),
    owner: null,
    steps: Array()
  }

  uploadedFiles: Array<File> = [];
  expandedIndex = 0;

  //array for storing the record of each updated steps
  updatedSteps: any = []

  //function for updating the step depending upon the index of the step (which step is updated)
  updateStep(step:any,index: number): void {
    const file = document.querySelector('.file') as HTMLInputElement;
    console.log(step)
    file.value = '';
    let updatedStepIndex = this.updatedSteps.findIndex((updatedStep: any) => updatedStep.index === index);
    this.process.steps[step.stepId] = {
      ...this.process.steps[step.stepId],
      ...this.updatedSteps[updatedStepIndex]
    };
    console.log(this.process.steps)
    var x = document.getElementById("snackbar3") as HTMLElement;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

  //function for deleting the step depending upon the index of the step (which step is deleted)
  deleteStep(index: number): void {
    this.process.steps.splice(index, 1);
  }

  //selecting multiple files for uploading documents of each step
  selectMultipleFiles(event: Event){
    const element = event.currentTarget as HTMLInputElement
    if (element.files && element.files.length > 0) {
      this.multipleFiles = element.files;
    }
  }


  //for uploading documents
  onFilesSubmit(index: number){
    const formData = new FormData();
    for(let file of this.multipleFiles){
      formData.append('file', file);
    }
    this.fileUploadService.saveFiles(formData).subscribe({
      next: data => {
        if(index>=0){
          if(this.updatedSteps[index]) {   
            this.updatedSteps[index] = ({
              ...this.updatedSteps[index],
              stepFiles: data
            })
          } else {
            this.updatedSteps.push({
              index: index,
              stepFiles: data
            })
          }
        }
        else{
          this.uploadedFiles = data;
        }
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
    private userService : UserService,
    private router: Router,
    private route: ActivatedRoute
    ) { }
  
  //function for updating the record of each edited step
  valuechange(event: Event, index: number): void {
    const element = event.currentTarget as HTMLInputElement
    if(element.name === 'step_owner'|| element.name === 'stepName' || element.name === 'stepDeadlines'){
      if(element.value === '' || element.value === null){
        this.error.name = true;
      }
      else{
        this.error.name = false;
        let updatedStepIndex = this.updatedSteps.findIndex((updatedStep: any) => updatedStep.index === index);
        if(this.updatedSteps[updatedStepIndex]) {   
          this.updatedSteps[updatedStepIndex] = ({
            ...this.updatedSteps[updatedStepIndex],
            [element.name]: element.value
          })
        } else {
          this.updatedSteps.push({
            index: index,
            [element.name]: element.value
          })
        }
        console.log(this.updatedSteps)
      }
    }
    else{
      if(this.updatedSteps[index]) {   
        this.updatedSteps[index] = ({
          ...this.updatedSteps[index],
          [element.name]: element.value
        })
      } else {
        this.updatedSteps.push({
          index: index,
          [element.name]: element.value
        })
      }
    }
  }

  //initiall assignments
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id){
      this.processService.getProcess(this.id).subscribe({
        next: data => {
          this.process = data;
          this.form.process = this.process.processName;
        },
        error: err => {
          throw new Error(err);
        }
      });
    }
    this.form.step_owner = "Select an owner"
    this.person = "Select a person"
    this.userService.getAllUsers().subscribe({
      next: data => {
        this.users = JSON.parse(data);
      },
      error: err => {
        throw new Error(err);
      }
    });
    this.process.owner = this.storageService.getUser().id;
    
  }
  
  //function for creating a new step
  onCreateStep(stepper: MatStepper):void{
    const file = document.querySelector('.file') as HTMLInputElement;
    file.value = '';
    const { name, description, exceptionsAndAssociatedRisks,optimization, deadlines, step_owner, contributors } = this.form;
    this.process.steps.push({
      stepId: (this.process.steps.length),
      stepName:name, 
      stepOwner: step_owner,
      stepDescription: description,
      stepDeadlines: deadlines,
      stepExceptionsAndAssociatedRisks: exceptionsAndAssociatedRisks,
      stepOptimization: optimization,
      stepFiles: this.uploadedFiles,
      stepContributors: contributors,
      stepCompleted: false
    });

    //resetting the form and moving to first step in stepper
    stepper.selectedIndex = 0;
    stepper.reset();
    this.form.name = null;
    this.form.description = null;
    this.form.exceptionsAndAssociatedRisks = null;
    this.form.optimization = null;
    this.form.deadlines = null;
    this.form.step_owner = "Select an owner"
    this.form.contributors = [];
  }

  //function for creating a new process
  onCreateProcess(): void {
    if(this.process.steps.length === 0 || this.form.process === null || this.form.process === ''){
      this.error['process'] = true;
    }
    else{
      this.process.processName = this.form.process;
      this.processService.createProcess(this.process).subscribe(
        data => {
          console.log(data);
          window.dispatchEvent(new Event('updateDb'));
        },
        err => {
          console.log(err);
        }
      )
      this.router.navigate(['/admin']);
    }
  }

  //function for updating the process
  onUpdateProcess(): void {
    if(this.process.steps.length === 0 || this.form.process === '' || this.form.process === null){
      this.error['process'] = true;
    }
    else{
      this.process.processName = this.form.process;
      console.log(this.process)
      this.processService.updateProcess(this.id, this.process).subscribe(
        data => {
          console.log(data);
          window.dispatchEvent(new Event('updateDb'));
          var x = document.getElementById("snackbar2") as HTMLElement;
          x.className = "show";
          setTimeout(() =>{ x.className = x.className.replace("show", ""); this.router.navigate(['/admin']);}, 2000);
        },
        err => {
          console.log(err);
        }
      )
      
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProcessService } from '../_services/process.service';
import { saveAs } from 'file-saver'

@Component({
  selector: 'app-view-process',
  templateUrl: './view-process.component.html',
  styleUrls: ['./view-process.component.css']
})
export class ViewProcessComponent implements OnInit {

  // process to show
  process: any;
  // id of process to show
  id: any;

  constructor(
    private processService: ProcessService,
    private route: ActivatedRoute
    ) { }

    // download file
    openFile(filename: any){
      this.processService.getFile(filename).subscribe({
        next: data => {
          saveAs(data, filename);
        },
        error: err => {
          throw new Error(err);
        }
      });
    }

  ngOnInit(): void {
    // getting process from process service
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id){
      this.processService.getProcess(this.id).subscribe({
        next: data => {
          this.process = data;
        },
        error: err => {
          throw new Error(err);
        }
      });
    }
  }
}
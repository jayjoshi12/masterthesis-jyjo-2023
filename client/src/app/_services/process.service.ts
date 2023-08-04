import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const Base_URL = 'http://localhost:8080/api/test/';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  constructor(private http: HttpClient) { }

  // create process
  createProcess(process: any): Observable<any> {
    return this.http.post(
      Base_URL + 'createProcess',
      process
    );
  }

  // get all processes
  getAllProcesses(id: any): Observable<any> {
    return this.http.get(Base_URL + 'processes/'+id);
  }

  // delete process with id
  deleteProcess(id: any): Observable<any> {
    return this.http.delete(Base_URL + 'deleteProcess/' + id);
  }

  // get specific process with id
  getProcess(id: any): Observable<any> {
    return this.http.get(Base_URL + 'process/' + id);
  }

  // updating process
  updateProcess(id: any, process: any): Observable<any> {
    return this.http.put(
      Base_URL + 'updateProcess/' + id,
      process
    );
  }

  // get file of step using filename
  getFile(filename: any): Observable<any> {
    return this.http.post(Base_URL + 'file', {
      filename: filename
    }, {responseType: 'blob'});

  }

  // get steps of processess of specific user
  getStepsOfUser(username: any): Observable<any> {
    return this.http.get(Base_URL + 'steps/' + username);
  }
  // get contribution steps of processess of specific user
  getContributionStepsOfUser(username: any): Observable<any> {
    return this.http.get(Base_URL + 'contributionSteps/' + username);
  }

  // update step of process
  updateStep(stepDetails: any): Observable<any> {
    return this.http.post(
      Base_URL + 'completeStep',
      stepDetails
    );
  }
  addNote(processId: any, stepId: any, contributorName:any, note: any): Observable<any> {
    return this.http.post(
      Base_URL + 'addNote',
      {
        processId,
        stepId,
        contributorName,
        note
      }
    );
  }
  checkedStep(processId: any, stepId: any, contributorName:any): Observable<any> {
    return this.http.post(
      Base_URL + 'checkedStep',
      {
        processId,
        stepId,
        contributorName
      }
    );
  }

}

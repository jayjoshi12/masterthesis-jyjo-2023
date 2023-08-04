import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const Base_URL = 'http://localhost:8080/api/test/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) { }

  saveFiles(formData: any): Observable<any> {
    return this.http.post(
      Base_URL + 'files',
      formData
    );
  }
}

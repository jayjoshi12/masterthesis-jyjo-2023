import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/test/';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  // home page content
  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  // get all users
  getAllUsers(): Observable<any> {
    return this.http.get(API_URL + 'users', { responseType: 'text' } );
  }

  // delete user
  deleteUser(id: number): Observable<any> {
    return this.http.delete(API_URL + 'deleteUser/' + id, { responseType: 'text' });
  }

  // get user by id
  getUser(id: number): Observable<any> {
    return this.http.get(API_URL + 'getUser/' + id);
  }

  // update user
  updateUser(id: number, username: String, email: String, password: String ,role: String): Observable<any> {
    return this.http.post(API_URL + 'updateUser/' + id, {
      username,
      email,
      password,
      roles:[role]
    });
  }
}

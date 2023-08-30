import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../domain/User';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7237/api/'

  constructor(private http: HttpClient) { }

  public register(user: User): Observable<any>{
    return this.http.post(`${this.baseUrl}Auth/SignUp`,user);
  }

  public login(user: User):Observable<any>{
    return this.http.post(`${this.baseUrl}Auth/SignIn`,user,{responseType: 'text'})
  }

}

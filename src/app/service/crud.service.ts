import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private baseUrl = 'https://localhost:7237/api/'
  constructor(private http: HttpClient) { }

  createItem(url:string,data: any): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}${url}`,data)
  }
  
    // Update: PUT request to update an item by ID
    updateItem(url:string,data: any): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}${url}`,data)
    }

    // Delete: DELETE request to delete an item by ID
    deleteItem(url:string,itemId: any): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}${url}/${itemId}`);
    }

    getAll(url:string):Observable<any> {
      return this.http.get(`${this.baseUrl}${url}`);
    }

    deleteMultipleItem(url:string,data:any):Observable<any>{
      return this.http.post<any>(`${this.baseUrl}${url}`,data);
    }

    getById(url:string, id:any):Observable<any>{
      return this.http.get<any>(`${this.baseUrl}${url}/${id}`)
    }
}

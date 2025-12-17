import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiMainService {

  private baseUrl = 'http://kathat.webquantix.in//api';

  constructor(private http: HttpClient) {}

  dpLogin(username: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('UserName', username)
      .set('Password', password);

    return this.http.get(`${this.baseUrl}/GetDPLogin`, { params });
  }
}

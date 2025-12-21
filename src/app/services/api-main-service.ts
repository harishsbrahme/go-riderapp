import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiMainService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  dpLogin(username: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('UserName', username)
      .set('Password', password);

    return this.http.get(`${this.baseUrl}/GetDPLogin`, { params }).pipe(
      tap((res: any) => {
        if (res) {
          this.setSession(res);
        }
      })
    );
  }

  getDPDashboard(dpid: any): Observable<any> {
    const params = new HttpParams().set('DPID', dpid);
    return this.http.get(`${this.baseUrl}/GetDPDashbord`, { params });
  }

  getPendingDeliveries(dpid: any): Observable<any> {
    const params = new HttpParams().set('DPID', dpid);
    return this.http.get(`${this.baseUrl}/GetPendingDeliveries`, { params });
  }

  private setSession(authResult: any) {
    // Modify this according to actual response structure. 
    // Assuming 'res' is not null implies success for now.
    // If authResult contains a token, store it.
    localStorage.setItem('user_session', JSON.stringify(authResult));
  }

  logout() {
    localStorage.removeItem('user_session');
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('user_session');
  }
}

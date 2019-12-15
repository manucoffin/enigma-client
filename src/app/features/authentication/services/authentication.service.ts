import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  public getToken(): string {
    const user = localStorage.getItem('user');

    return user ? user : null;
  }

  public isAuthenticated(): boolean {
    const user = localStorage.getItem('user');

    return !!user && !this.isTokenExpired();
  }

  public isTokenExpired(): boolean {
    const helper = new JwtHelperService();
    const accessToken = localStorage.getItem('user');

    return helper.isTokenExpired(accessToken);
  }

  public storeToken(token): void {
    localStorage.setItem('user', token);
  }

  public login(username: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    // Simulate the return of a JWT while API is not live
    return of(
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImZpcnN0bmFtZSI6Imdlb3JnZXMiLCJsYXN0bmFtZSI6ImFiaXRib2wiLCJ1c2VybmFtZSI6Imdlb3JnZXNhYml0Ym9sIiwianRpIjoiMzk0YTNhZGItMGY4My00NWM0LThmZDYtNDY4N2U2NjcxNTgyIiwiaWF0IjoxNTc2NDM0ODQzLCJleHAiOjE1NzY0Mzg1MzJ9.45dLrKYsCCPYl26zUqa9U2N06xLf21586MwH1-I4sBM',
    );
    // return this.http.post<any>(
    //   `${environment.enigmaServerUrl}/login`,
    //   formData,
    // );
  }

  public register(username: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return this.http.post<any>(
      `${environment.enigmaServerUrl}/register`,
      formData,
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  public isAuthenticated(): boolean {
    const user = localStorage.getItem('user');
    console.log('user', user);

    return !!user;
  }

  public storeToken(token): void {
    localStorage.setItem('user', token);
  }

  public login(username: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return this.http.post<any>(
      `${environment.enigmaServerUrl}/login`,
      formData,
    );
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

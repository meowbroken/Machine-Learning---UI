import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private apiUrl = 'http://localhost:8000/api/predict/';

  constructor(private http: HttpClient) {}

  predictQoL(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}

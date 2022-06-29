import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ActivatedRoute } from '@angular/router';
import { of, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpService,
    private route: ActivatedRoute
  ) { }

  login(data: any): Observable<any>{
    return this.http.postlogin('/login', data, false);
  }
}

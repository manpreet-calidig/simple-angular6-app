import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  post(serviceName: string, data: any){
    var userinfo =  JSON.parse(localStorage.getItem('currentUser') || '{}');
    const headers = {'Content-Type': 'application/json; multipart/form-data; text/html','Authorization': userinfo.remember_token};
    const url = environment.apiUrl+serviceName;
    return this.http.post(url, data, {headers});
  }

  get(serviceName: string){
	var userinfo =  JSON.parse(localStorage.getItem('currentUser') || '{}');
    const headers = {'Content-Type': 'application/json','Authorization': userinfo.remember_token};
    const url = environment.apiUrl+serviceName;
    return this.http.get(url, {headers});
  }

  postImage(serviceName: string, data: any){
    var userinfo =  JSON.parse(localStorage.getItem('currentUser') || '{}');
    const headers = {'Authorization': userinfo.remember_token};
    const url = environment.apiUrl+serviceName;
    return this.http.post(url, data, {headers});
  }

  postlogin(serviceName: string, data: any, isAuth = true){
    const headers = {'Content-Type': 'application/json; multipart/form-data; text/html'};

    const options = { headers: new HttpHeaders(headers), withCredentials: false};
    const url = environment.apiUrl+serviceName;
    data.withAuth = isAuth;
    return this.http.post(url, data, options);
  }
  postcontent(serviceName: string, data: any){
    var userinfo =  JSON.parse(localStorage.getItem('currentUser') || '{}');
    const headers = {'Authorization': userinfo.remember_token};
    const url = environment.apiUrl+serviceName;
    return this.http.post(url, data, {headers});
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpService } from '../services/http.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EncryptDecryptService } from '../services/encrypt-decrypt.service';
@Component({
  selector: 'app-header',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  notificationForm: any = FormGroup;

  a: number=0;
  image:any;
  type: any
  permission: any
  id:any;
  notiSource:any;
  defaultimage = '../../assets/images/user.jpg';
  url:any;
  firstname:any;
  lastname:any;
  dataSource:any;
  currentpath = ''
  count:any;
  status:any
  countvisible = false;
  role:any
  constructor(private router: Router,
    private http:HttpService,
    private formBuilder: FormBuilder,
    private encryptDecryptService: EncryptDecryptService,
    private route: Router) {
      this.currentpath = window.location.pathname
      this.currentpath = window.location.pathname
      let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
      this.id = info.id
      this.type = info.type
      let image = info.image
      this.role = info.role
      if(this.type == 'user' || this.type == 'employee'){
        let permission = this.encryptDecryptService.getPermissions();
        this.permission = this.encryptDecryptService.decryptionHandler(permission);
      }
      if(this.type == 'employee'){
        this.firstname = info.first_name
        this.lastname = info.last_name
        this.url = environment.site+'employee/'
        this.image = this.url+image
        this.getEmployeeData();
      }
      if(this.type == 'client'){
        this.firstname = info.first_name
        this.lastname = info.last_name
        this.url = environment.site+'client/'
        this.image = this.url+image
        this.editClient();
      }
      if(this.type == 'user'){
        this.firstname = info.name
        this.url = environment.site+'user/'
        if(image == null || undefined || '') {
          console.log(image)
        } else {
          console.log(image)
        }
        this.image = this.url+image
        this.editUser();
      }
      this.getNotification(this.id);
      this.notificationForm = this.formBuilder.group({
        status:['']
      });
      this.getcount();
     }

  ngOnInit(): void {

  }

  getNotification(id:any){
    this.http.get('/notification/'+id).subscribe((res:any) => {
      if(res.message == 'Unauthenticated') {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('permissions');
        localStorage.clear();
        location.href = '/'
      }
      this.notiSource = res.data;
      // console.log(this.notiSource);
    })
  }
  getEmployeeData(){
    this.http.get('/editemployee/'+this.id).subscribe((res:any) => {
    this.dataSource = res;
    this.url = environment.site+'employee/';
    this.image = this.url+res.image
  })
}
editUser(){
  this.http.get('/admin/'+this.id).subscribe((res: any) => {
    this.dataSource = res
    this.url = environment.site+'user/';
    this.image = this.url+res.image
  })
}
editClient(){
  this.http.get('/editclient/'+this.id).subscribe((res:any) => {
    this.dataSource = res;
    this.url = environment.site+'client/';
    this.image = this.url+res.image

  })
}
getcount(){

    //  this.notificationForm.value.status = 'read';
      this.http.get('/notificationstatus').subscribe(res => {
        this.count = res;
        if(this.count>0){
          this.countvisible = true;
        }
    })
}
read(){
  this.countvisible = false;
    //  this.notificationForm.value.status = 'read';
    if(this.type=='user'){
      this.status = 'AR';
    }
    if(this.type=='employee'){
      this.status = 'ER';
    }
    this.http.get('/notificationstatus?status='+this.status).subscribe(res => {
      console.log(res)
    })

}
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('permissions');
    localStorage.clear();
    location.href = '/'
  }

  getPermission(id:any,preid:any){
    let string = this.permission[id];
    if(string.indexOf(preid) !== -1){
      return true
    }
    return false
  }

  activeDSR() {
    console.log(this.currentpath)
    if(this.currentpath == '/dsr')
    {
      window.location.reload();
    }
  }

  HandleCollaspableToggle() {
    let body = document.getElementsByTagName('body');
    if(body[0].classList.contains('side-closed')) {
      body[0].classList.remove('side-closed')
      body[0].classList.remove('submenu-closed')
    } else {
      body[0].classList.add('side-closed')
      body[0].classList.add('submenu-closed')
    }
  }
}

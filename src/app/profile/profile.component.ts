import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../notification.service';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: any = FormGroup;

  url:any;
  isSubmitted = false;
  message: any = null;
  showModal: boolean = false;
  content: any = '';
type:any;
id:any;
dataSource:any;
length:any;
skill:any;
imgURL: any;

  constructor(private http:HttpService, private router: Router,private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    private notifyService : NotificationService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.type = info.type;
    this.id=info.id;
    if(this.type == 'employee'){
      this.getEmployeeData();
    }else if(this.type == 'user')
    {
      this.editUser();
    }else{
      this.editClient();
    }
    this.profileForm = this.formBuilder.group({
      file: [''],
    });
  }
  getEmployeeData(){
    this.http.get('/editemployee/'+this.id).subscribe((res:any) => {
    this.dataSource = res;
    this.url = environment.site+'employee/';
    this.imgURL = this.url+res.image
    // this.count = res.data.total;
    this.skill = this.dataSource.skills.replace(/,/g, ", ");
    if(this.dataSource == ''){
      this.length = 0;
    }else{
      this.length = 1;
    }
    console.log(res)
  })
}
editUser(){
  this.http.get('/admin/'+this.id).subscribe((res: any) => {
    this.dataSource = res
    this.url = environment.site+'user/';
    this.imgURL = this.url+res.image
  })
}
editClient(){
  this.http.get('/editclient/'+this.id).subscribe((res:any) => {
    this.dataSource = res;
    this.url = environment.site+'client/';
    this.imgURL = this.url+res.image

  })
}
onSubmit(){
  this.isSubmitted = true;
  this.message = null;

  if (this.profileForm.invalid) {
    return;
  }
  this.profileForm.value.type = this.type
  this.spinner.show();
  this.http.post('/profileupdate/'+this.id,this.profileForm.value).subscribe((res:any) => {
    this.spinner.hide();
    
    let exist = res
    if(exist != '')
    {
      this.notifyService.showSuccess("Image update successfully !!", "Employee Updated")
      location.reload();
    }else{
      this.notifyService.showError("Image not update !!", "Employee not Updated")
    }

})
}
imageUpload(event:any){
  const reader = new FileReader();
  if(event.target.files && event.target.files.length) {
    const [file] = event.target.files;
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.profileForm.patchValue({
        file: reader.result
     });
      this.cd.markForCheck();
    };
  }
}
viewInfo(info: any) {

}

show(content: any) {
  console.log(content)
  this.content = content
  this.showModal = true; // Show-Hide Modal Check
  
}
//Bootstrap Modal Close event
hide() {
  this.showModal = false;
}
testfunction(data: any) {
  //alert(data);
  const newdate = new Date(data);
  return moment(newdate).format('DD-MMM-YYYY');
}
}

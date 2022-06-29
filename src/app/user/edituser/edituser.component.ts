import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../notification.service'
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EdituserComponent implements OnInit {

  lists: any = ""
  submitform: any = FormGroup
  isSubmitted = false
  message: any = null
  loading = false
  modules = ""
  checked:any = []
  checkjson: any
  url = environment.site+'user/'
  profileinfo: any
  userid: any
  profileimage:any
  permission: any

  constructor(private spinner: NgxSpinnerService,private http: HttpService, private formBuilder: FormBuilder,private route: ActivatedRoute,private router: Router,private cd: ChangeDetectorRef,private notifyService : NotificationService) { }

  ngOnInit(): void {
    this.submitform = this.formBuilder.group({
      name: ['', Validators.required],
      module:['']
    })
    this.editUser(this.route.snapshot.params.id)
    this.getresponse()
    this.userid = this.route.snapshot.params.id
    
  }

  editUser(id:any){
    this.http.get('/user/edit/'+id).subscribe((res: any) => {
      this.profileinfo = res.data
      this.submitform.controls['name'].setValue(this.profileinfo.role);
      this.checkjson = this.profileinfo.permission
      let module = this.profileinfo.module
      for(let i=0; i<module.length; i++){
        this.checked.push(module[i]);
      }

    }, err => {
         console.log(err);
    })
  }

  findvalue(val:any){
     if(this.profileinfo.permission.indexOf(val) !== -1) {
       return true
     }else{
      return false
     } 
  }
  onFileChange(event: any) {
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.submitform.patchValue({
          file: reader.result
       });

        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  get errorControl() {
    return this.submitform.controls;
  }
  onCheckboxChange(event: any, module : any,checkbox: any) { 
      if ( event.target.checked ) {
        if(this.checked.indexOf(module+"-"+checkbox) !== -1) {
          this.removeCheckedFromArray(module+"-"+checkbox);
        }else{
          this.checked.push(module+"-"+checkbox);
        }
      } else {
        let index = this.removeCheckedFromArray(module+"-"+checkbox);
        this.checked.splice(index,1);
      }
      this.checkjson = this.checked.join()
  }
  removeCheckedFromArray(checkbox : String) {
    return this.checked.findIndex((category: any)=>{
      return category === checkbox;
    })
  }
  emptyCheckedArray() {
    this.checked = [];
  }


  getresponse(){
    this.http.get('/role/list').subscribe((data: any) => {
      this.lists = data.data
      
    }, err => {
         console.log(err);
    })
  }

  onSubmit() {
    this.message = null;
    this.isSubmitted = true;
    console.log(this.submitform.value)
    if (this.submitform.invalid) {
      return;
    }

    this.spinner.show();
    this.http.post('/user/update/'+this.userid,this.submitform.value).subscribe((data: any) => {
      this.spinner.hide();
      this.notifyService.showSuccess("Role update successfully !!", "Role Updated")
      this.router.navigate(['/role']);
    }, err => {
         console.log(err);
    })
  } 


}

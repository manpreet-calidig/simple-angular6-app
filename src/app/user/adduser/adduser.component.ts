import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../notification.service'
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {
  lists: any = ""
  submitform: any = FormGroup
  isSubmitted = false
  message: any = null
  loading = false
  modules = ""
  checked:any = []
  checkjson: any
  url = environment.apiUrl+'/user/'
  constructor(private spinner: NgxSpinnerService,private http: HttpService, private formBuilder: FormBuilder,private route: ActivatedRoute,private router: Router,private cd: ChangeDetectorRef,private notifyService : NotificationService) { }

  ngOnInit(): void {
    this.getresponse()
    this.submitform = this.formBuilder.group({
      //email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      name: ['', Validators.required],
      //designation:['', Validators.required],
      //telephone:['', Validators.required],
      //file:[''],
      module:['']
    });
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
        this.checked.push(module+"-"+checkbox);
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
    if (this.submitform.invalid) {
      return;
    }

    this.spinner.show();
    this.http.post('/user/add',this.submitform.value).subscribe((data: any) => {
      this.spinner.hide();
      this.notifyService.showSuccess("Role add successfully !!", "Role Added")
      this.router.navigate(['/role']);
    }, err => {
         console.log(err);
    })
  } 

  reset(){
    this.submitform.reset();
  }
}

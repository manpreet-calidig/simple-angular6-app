import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../notification.service';
import { HttpService } from '../services/http.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  clientForm: any = FormGroup;
  imgURL: any;
  isSubmitted = false;
  message: any = null;
  loading = false
  projectSource:any;
  companies:any[] = [];
  url = environment.apiUrl+'/client/'
  constructor(private cd: ChangeDetectorRef,
    private http:HttpService,
    private formBuilder: FormBuilder,
    private notifyService : NotificationService,
    private router: Router,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit(): void {
    this.clientForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name:['', Validators.required],
      //email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      email: [''],
      telephone: [''],
      designation: [''],
      gender: [''],
      project_type: ['', Validators.required],
      country: [''],
      address: [''],
      website: [''],
      app_name: [''],
      file: [''],
 
    });
    this.getProjectTypeData();
  }
  getProjectTypeData(){
    this.http.get('/project_type').subscribe((res:any) => {
    this.companies = res.data.data;
    console.log(this.projectSource);
  })
}
addTagFn(name: any) {
  return { name: name};
}
  onSubmit(){
      this.isSubmitted = true;
      this.message = null;
      if (this.clientForm.invalid) {
        return;
      }
      this.spinner.show();
      this.http.post('/addclient',this.clientForm.value).subscribe((res:any) => {
      this.spinner.hide();
      let exist = res.data;
      if(exist == 'exist')
      {
        this.notifyService.showWarning("Your Email is Already Exist !!", "Change Email")
      }
      else{
        this.notifyService.showSuccess("Client add successfully !!", "Client Added")
        this.router.navigate(['/client/listclient']);
      }
    })
  }
  get errorControl() {
    return this.clientForm.controls;
  }
  imageUpload(event:any){
   
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.clientForm.patchValue({
          file: reader.result
       });
        this.cd.markForCheck();
      };
    }
  }

  reset(){
    this.clientForm.reset();
  }
}

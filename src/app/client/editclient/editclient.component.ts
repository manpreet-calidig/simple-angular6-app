import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-editclient',
  templateUrl: './editclient.component.html',
  styleUrls: ['./editclient.component.css']
})
export class EditclientComponent implements OnInit {

  id:any;
  data:any;
  files:any;
 imagePath:any;
  imgURL: any;
  image:any;
clientForm: any = FormGroup;
  isSubmitted = false;
  message: any = null;
  profileimage:any
  loading = false
  projectSource:any;
  selected:any;
  companies:any[] = [];
  url = environment.site+'client/'
  constructor(private http:HttpService,
    private cd: ChangeDetectorRef,
    private notifyService : NotificationService,
    private router: Router,
    private route:ActivatedRoute,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit(): void {
  this.id=this.route.snapshot.params.id;
    this.editClient(this.id);
    this.clientForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name:['', Validators.required],
      telephone: [''],
      designation: [''],
      gender: ['', ],
      project_type: ['', Validators.required],
      country: ['',],
      address: ['' ],
      website: [''],
      app_name: [''],
      //email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      email: [''],
      file:['']
    });
    this.getProjectTypeData();
  }
  getProjectTypeData(){
    this.http.get('/project_type').subscribe((res:any) => {
    this.companies = res.data.data;
    console.log(this.companies);
  })
}
  editClient(id:any){
    this.http.get('/editclient/'+id).subscribe((res:any) => {
      this.data = res;
      this.profileimage = this.data.image
      this.clientForm.controls['first_name'].setValue(this.data.first_name);
      this.clientForm.controls['last_name'].setValue(this.data.last_name);
      this.clientForm.controls['email'].setValue(this.data.email);
      this.clientForm.controls['designation'].setValue(this.data.designation);
      this.clientForm.controls['telephone'].setValue(this.data.telephone);
      this.clientForm.controls['designation'].setValue(this.data.designation);
      this.clientForm.controls['gender'].setValue(this.data.gender);
      this.clientForm.controls['country'].setValue(this.data.country);
      this.clientForm.controls['website'].setValue(this.data.website);
      this.clientForm.controls['app_name'].setValue(this.data.app_name);
      this.clientForm.controls['address'].setValue(this.data.address);
      this.selected  = this.data.name;
      console.log(this.selected)
    })
  }
  addTagFn(name: any) {
    return { name: name};
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
         console.log(file);
          this.cd.markForCheck();
        };
      }
  }
  onUpdate(){
      this.isSubmitted = true;
      this.message = null;
      
      if (this.clientForm.invalid) {
        return;
      }
      this.spinner.show();
      this.http.post('/clientupdate/'+this.id,this.clientForm.value).subscribe((res: any) => {
        this.spinner.hide();
      this.notifyService.showSuccess("Client update successfully !!", "Client Updated")
      this.router.navigate(['/client/listclient']);
    })
  }
  get errorControl() {
    return this.clientForm.controls;
  }
  

}

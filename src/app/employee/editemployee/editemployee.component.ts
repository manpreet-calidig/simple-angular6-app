import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { Employee } from '../employee.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/notification.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-editemployee',
  templateUrl: './editemployee.component.html',
  styleUrls: ['./editemployee.component.css']
})
export class EditemployeeComponent implements OnInit {
  id:any;
  data:any;
  files:any;
  imagePath:any;
  imgURL: any;
  image:any;
  employee=new Employee();
  loginForm: any = FormGroup;
  isSubmitted = false;
  message: any = null;
  loading = false
  url = environment.site+'employee/'
  profileimage:any
  employeeroles:any
  dataSource: any
  selected:any;
  skills:any;
  companies: any[] = [];

  constructor(private http:HttpService,
    private route:ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    public datepipe: DatePipe,
    private cd: ChangeDetectorRef,
    private notifyService : NotificationService,private spinner: NgxSpinnerService) { }

  ngOnInit() {
      this.id=this.route.snapshot.params.id;
      this.editEmployee(this.id);
      this.loginForm = this.formBuilder.group({
        first_name: ['', Validators.required],
        last_name:['', Validators.required],
        telephone: ['', Validators.required],
        designation: ['', Validators.required],
        gender: ['', Validators.required],
        dob: [''],
        date: [''],
        address: [''],
        role: ['', Validators.required],
        file: [''],
        manager_id: [''],
        email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
        skills: [''],
        streams: [''],
        last_working_day: ['']
      });
      this.employeeRoleList()
    this.getemployee()
    this.getskills()
  }
editEmployee(id:any){
  this.http.get('/editemployee/'+id).subscribe((res:any) => {
    this.data = res;
    this.employee = this.data;
    console.log(this.employee.address, "------")
    console.log(this.employee, "------")
    this.employee.date = this.datepipe.transform(this.data.join_date, 'MM/dd/yyyy');
    this.employee.dob = this.datepipe.transform(this.data.dob, 'MM/dd/yyyy');
    this.loginForm.controls['last_working_day'].setValue(this.datepipe.transform(this.data.last_working_day, 'MM/dd/yyyy'))
  this.loginForm.controls['manager_id'].setValue(this.data.manager_id);
  this.selected  = this.data.name;
  console.log(this.selected)

    if(this.data.image){
      this.profileimage = this.url+this.data.image;
    }
    this.loginForm.controls['role'].setValue(this.data.role);
  })
}
get errorControl() {
  return this.loginForm.controls;
}
addTagFn(name: any) {
  return { name: name};
}
getskills(){
  this.http.get('/skills').subscribe((res:any) => {
    this.companies = res.data;
    console.log(this.companies);
});
}
onUpdate(){
  this.isSubmitted = true;
    this.message = null;
    if(this.loginForm.value.date) {
      this.loginForm.value.joining_date = this.datepipe.transform(this.loginForm.value.date, 'yyyy-MM-dd');
    }
    if(this.loginForm.value.dob) {
      this.loginForm.value.birth_date = this.datepipe.transform(this.loginForm.value.dob, 'yyyy-MM-dd');
    }
    if(this.loginForm.value.last_working_day) {
      this.loginForm.value.last_working_day = this.datepipe.transform(this.loginForm.value.last_working_day, 'yyyy-MM-dd');
    }

    this.spinner.show();
    this.http.post('/employeeupdate/'+this.id,this.loginForm.value).subscribe((res: any) => {
    this.spinner.hide();
    this.notifyService.showSuccess("Employee update successfully !!", "Employee Updated")
    this.router.navigate(['/employee/listemployee']);
  })
}

imageUpload(event:any){
  const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.loginForm.patchValue({
          file: reader.result
       });
        this.cd.markForCheck();
      };
    }
}
employeeRoleList(){
  this.http.get('/employeerole').subscribe((res:any) => {
      this.employeeroles = res.data
  })
}
getemployee(){
    this.http.get('/employee').subscribe((res:any) => {
		this.dataSource = res.data.data;
    //this.loginForm.controls[''].disable();
	})
}
}

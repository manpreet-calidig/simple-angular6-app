import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Employee } from './employee.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { empty } from 'rxjs';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  files:any;
  imagePath:any;
  imgURL: any;
  loginForm: any = FormGroup;
  isSubmitted = false;
  message: any = null;
  loading = false
  url = environment.site+'employee/'
  employeeroles:any
  id:any;
  data:any;
  dataSource:any;
  skills:any;
  skill: any[] = [];
  companies: any[] = [];
    companiesNames = ['Uber', 'Microsoft', 'Flexigen'];
  constructor(
    private http:HttpService,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private notifyService : NotificationService,
    private cd: ChangeDetectorRef,
    private router: Router,private spinner: NgxSpinnerService) { }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name:['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      telephone: ['', Validators.required],
      designation: ['', Validators.required],
      gender: ['', Validators.required],
      dob: [''],
      date: ['', Validators.required],
      address: [''],
      role: ['', Validators.required],
      manager_id: [''],
      skills: new FormControl(null),
      streams: [''],
      file: [''],
      last_working_day: ['']
    });
    this.getemployee()
    this.employeeRoleList()
    this.getskills()
    this.companiesNames.forEach((c, i) => {
      // this.companies.push({ id: i, name: c });
      // console.log(this.companies)
  });
  }
  get errorControl() {
    return this.loginForm.controls;
  }

  getemployee(){
    this.http.get('/employee').subscribe((res:any) => {
    this.dataSource = res.data.data;
    console.log(this.dataSource);
  })
}
addTagFn(name: any) {
  return { name: name};
}
getskills(){
    this.http.get('/skills').subscribe((res:any) => {
      this.companies = res.data;
  });
}

  onChange(event:any){
    // console.log(event);
    this.id = event.target.value;
    console.log(event.target.value);
    this.http.get('/editemployee/'+this.id).subscribe((res:any) => {
      this.data = res;
      console.log(this.data);
    })
  }

  onSubmit(){
      this.isSubmitted = true;
      this.message = null;
      if(this.loginForm.value.date) {
        this.loginForm.value.joining_date = this.datepipe.transform(this.loginForm.value.date, 'yyyy-MM-dd');
      }
      if(this.loginForm.value.dob) {
        this.loginForm.value.birth_date = this.datepipe.transform(this.loginForm.value.dob, 'yyyy-MM-dd');
      }
      if(this.loginForm.value.dob) {
        this.loginForm.value.last_working_day = this.datepipe.transform(this.loginForm.value.last_working_day, 'yyyy-MM-dd');
      }

      if (this.loginForm.invalid) {
        return;
      }
      this.spinner.show();
      this.http.post('/addemployee', this.loginForm.value).subscribe((res:any) => {
        this.spinner.hide();
        let exist = res.data
        if(exist == 'exist'){
          this.notifyService.showWarning("Your Email is Already Exist !!", "Change Email")
        }else{
          this.notifyService.showSuccess("Employee add successfully !!", "Employee Added")
          this.router.navigate(['/employee/listemployee']);
        }
        this.applyActiveClass()
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

  reset(){
    this.loginForm.reset();
    this.router.navigate(['/employee/listemployee']);
    this.applyActiveClass();
  }

  applyActiveClass() {
    let list = document.getElementById('listEmployeeRoute');
    let add = document.getElementById('addEmployeeRoute');
    list?.classList.add('active');
    add?.classList.remove('active');
  }

}

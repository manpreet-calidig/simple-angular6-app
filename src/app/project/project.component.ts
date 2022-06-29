import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../notification.service';
import { HttpService } from '../services/http.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmedValidator } from './project.validators';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  
   projectForm: any = FormGroup;
   isSubmitted = false;
   message: any = null;
   loading = false
   url = environment.site+'project/'
   dataSource:any;
   employeeSource:any;
   projectSource:any;
   data:any;
   id:any;
   files:string  []  =  [];
   empvalue:any [] = [];
   empvalueSource:any;
   count:any;
  //  public addmore: any[] = [{
  //   employee_id: '',
  //   availability: '',
  //   allocation: ''
  // }];
  constructor(
    private http:HttpService,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private notifyService : NotificationService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      project_name: ['', Validators.required],
      status: ['', Validators.required],
      client_id:[''],
      client_name: [''],
      client_email: [''],
      project_type: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      team_size: [''],
      assign_employee: [''],
      hour: [''],
      items: this.formBuilder.array([])
    });
    this.getclient();
    this.getEmployeeData();
    this.getProjectTypeData();
    this.count = 0;
  }
  get errorControl() {
    return this.projectForm.controls;
  }

  get formArr() {
    return this.projectForm.get('items') as FormArray;
  }
  addAddress(event:any) {
    this.count = event.length;
    this.empvalue = event
    this.http.get('/empvalue?value='+this.empvalue).subscribe((res:any) => {
      this.empvalueSource = res;
      
      this.formArr.clear();
      for (const x of this.empvalueSource) {
      //   if(x.allocation == '')
      // {
        let emp_id = x.employee_id;
        let name = x.name;
        let avail = x.availability;
        let alloc = x.allocation;
        // let items = this.projectForm.get('items') as FormArray;
        this.formArr.push(this.formBuilder.group({
          employee_id : [emp_id, [Validators.required]],
          name : [name, [Validators.required]],
          availability : [avail, [Validators.required]],
          allocation : [alloc, [Validators.required]]
        }, {validator: ConfirmedValidator('availability', 'allocation')} 
        ));
      // }
        // this.formArr.push(this.formBuilder.group(x));
        console.log(this.formArr)
      }
      // this.formArr.removeAt(0);
      console.log(this.empvalueSource);
    })
  }

  getclient(){
      this.http.get('/client').subscribe((res:any) => {
      this.dataSource = res.data.data;
      console.log(this.dataSource);
    })
  }
  getProjectTypeData(){
      this.http.get('/project_type').subscribe((res:any) => {
      this.projectSource = res.data.data;
      console.log(this.projectSource);
    })
  }
  getEmployeeData(){
      this.http.get('/employeelist').subscribe((res:any) => {
      this.employeeSource = res.data;
      console.log(this.employeeSource);
    })
  }
  onChange(event:any){
    this.id = event.target.value;
    console.log(event.target.value);
    this.http.get('/editclient/'+this.id).subscribe((res:any) => {
      this.data = res;
      this.projectForm.controls['client_name'].setValue(this.data.first_name);
      this.projectForm.controls['client_email'].setValue(this.data.email);
    })
  }
  onSubmit(){
    //console.log(this.assign_employee)
    this.isSubmitted = true;
    this.message = null;
    if(this.projectForm.value.start)
    {
      this.projectForm.value.start_date = this.datepipe.transform(this.projectForm.value.start, 'yyyy-MM-dd');
    }
    if(this.projectForm.value.end)
    {
      this.projectForm.value.end_date = this.datepipe.transform(this.projectForm.value.end, 'yyyy-MM-dd');

    }

      if (this.projectForm.invalid) {
        return;
      }
      if(this.projectForm.value.project_name == 'Calidig-Internal')
      {
        return;
      }
      this.spinner.show();
      this.http.post('/addproject', this.projectForm.value).subscribe((res: any) => {
      if(this.files.length == 0){
        this.spinner.hide();
        this.notifyService.showSuccess("Project add successfully !!", "Project Added")
        this.router.navigate(['/project']);
      }else{
        this.fileUpload(res.data.id)
      }
    }, err=>{
      this.spinner.hide();
      if(err.status == '500'){
        this.notifyService.showSuccess("Project add successfully !!", "Project Added")
        this.router.navigate(['/project']);
      }
    })
  }

  onFileChange(event: any)  {
    for  (var i =  0; i <  event.target.files.length; i++)  {  
        this.files.push(event.target.files[i]);
    }
  }  

  fileUpload(id:any){
    const formData =  new  FormData();
    for  (var i =  0; i <  this.files.length; i++)  {  
        formData.append("file[]",  this.files[i]);
    } 
    this.http.postImage('/document/'+id, formData).subscribe((res: any) => {  
      this.spinner.hide();
      this.notifyService.showSuccess("Project add successfully !!", "Project Added")
      this.router.navigate(['/project']);
    })
  }

  reset(){
    this.projectForm.reset();
  }
}

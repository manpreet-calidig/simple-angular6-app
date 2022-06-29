import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmedValidator } from '../project.validators';

@Component({
  selector: 'app-editproject',
  templateUrl: './editproject.component.html',
  styleUrls: ['./editproject.component.css']
})
export class EditprojectComponent implements OnInit {
  projectForm: any = FormGroup;
  dataSource:any;
  isSubmitted = false;
  message: any = null;
  loading = false
  projectSource:any;
  employeeSource:any;
  id:any;
  data:any;
  files:string  []  =  [];
  uplodedfiles: any
  selected: any
  emp:any
  count:any
  empvalue:any
  empvalueSource:any
  project_name:any;
  url = environment.site+'files/'
  type:any;
  constructor(private http:HttpService,
    private notifyService : NotificationService,
    private router: Router,
    private route:ActivatedRoute,
    public datepipe: DatePipe,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService) { }

    ngOnInit(): void {
      this.id=this.route.snapshot.params.id;
      let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
      this.type = info.type;
      this.projectForm = this.formBuilder.group({
        project_name: ['', Validators.required],
        status: [''],
        client_id:[''],
        client_name: [''],
        client_email: [''],
        project_type: ['', Validators.required],
        start: ['', Validators.required],
        end: ['', Validators.required],
        team_size: [''],
        assign_employee: [''],
        hour: [''],
      items: this.formBuilder.array([ this.createItem() ])

      });
      this.getclient();
      this.getEmployeeData();
      this.getProjectTypeData();
      this.editProject(this.id);
    }
    get errorControl() {
      return this.projectForm.controls;
    }

    createItem(): FormGroup {
    
      return this.formBuilder.group({
        employee_id: ['', Validators.required],
        name: ['', Validators.required],
        availability: ['', Validators.required],
        allocation: ['', Validators.required],
  
      });
    }
  
    get formArr() {
      return this.projectForm.get('items') as FormArray;
    }
    addAddress(event:any) {
      this.count = event.length;
      this.empvalue = event
      // console.log(event)
      this.http.get('/empvalue?value='+this.empvalue).subscribe((res:any) => {
        this.empvalueSource = res;
        this.formArr.clear();
        for (const x of this.empvalueSource) {
          // this.formArr.push(this.formBuilder.group(x));
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
        }
      })
    }
    editProject(id:any){
      
      
      this.http.get('/editproject/'+id).subscribe((res:any) => {
        this.data = res[0].project;
        this.emp = res[0].empavailble;
        this.project_name = this.data.project_name;
        this.projectForm.controls['project_name'].setValue(this.data.project_name);
        this.projectForm.controls['client_id'].setValue(this.data.client_id);
        this.projectForm.controls['client_name'].setValue(this.data.client_name);
        this.projectForm.controls['client_email'].setValue(this.data.client_email);
        this.projectForm.controls['project_type'].setValue(this.data.project_type);
        this.projectForm.controls['team_size'].setValue(this.data.team_size);
        this.projectForm.controls['status'].setValue(this.data.status);
        this.projectForm.controls['hour'].setValue(this.data.hour);
        for (const x of this.emp) {
          // this.formArr.push(this.formBuilder.group(x));
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
        }
        this.formArr.removeAt(0);
        this.selected  = this.data.assign_employee
        this.projectForm.controls['start'].setValue(this.datepipe.transform(this.data.start_date, 'MM/dd/yyyy'));
        this.projectForm.controls['end'].setValue(this.datepipe.transform(this.data.end_date, 'MM/dd/yyyy'));

        if(this.data.upload_document != '') {
          let uploaddocument = this.data.upload_document
          let imagesUpload = uploaddocument.split(',')
          let cleanArray = imagesUpload.filter((s: any) => s.replace(/\s+/g, '').length !== 0)
          this.uplodedfiles = cleanArray
        }
        
      })
    }
    getclient(){
        this.http.get('/client').subscribe((res:any) => {
        this.dataSource = res.data.data;
      })
    }
    getProjectTypeData(){
        this.http.get('/project_type').subscribe((res:any) => {
        this.projectSource = res.data.data;
        console.log(this.projectSource)
      })
    }
    getEmployeeData(){
        this.http.get('/employeelist').subscribe((res:any) => {
        this.employeeSource = res.data;
      })
    }
    onChange(event:any){
      this.id = event.target.value;
      this.http.get('/editclient/'+this.id).subscribe((res:any) => {
        this.data = res;
        this.projectForm.controls['client_name'].setValue(this.data.first_name);
        this.projectForm.controls['client_email'].setValue(this.data.email);
      })
    }
    onUpdate(){
      this.isSubmitted = true;
        this.message = null;
        
        if (this.projectForm.invalid) {
          return;
        }
        if(this.projectForm.value.start)
        {
          this.projectForm.value.start_date = this.datepipe.transform(this.projectForm.value.start, 'yyyy-MM-dd');
        }
        if(this.projectForm.value.end)
        {
          this.projectForm.value.end_date = this.datepipe.transform(this.projectForm.value.end, 'yyyy-MM-dd');
    
        }
        this.spinner.show();
        this.http.post('/projectupdate/'+this.id,this.projectForm.value).subscribe((res: any) => {

          if(this.files.length != 0 || this.uplodedfiles != ''){
            this.fileUpload(res.data.id)
          }else{
            this.spinner.hide();
            this.notifyService.showSuccess("Project update successfully !!", "Project Updated")
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
      if(this.uplodedfiles) {
        let oldfiles = this.uplodedfiles.join(',')
        formData.append("oldfiles",  oldfiles)
      }
      
      this.http.postImage('/document/'+id, formData).subscribe((res: any) => {  
        this.spinner.hide();
        this.notifyService.showSuccess("Project update successfully !!", "Project Updated")
        this.router.navigate(['/project']);
      })
    }

    RemoveElementFromArray(element: any) {
      this.uplodedfiles.forEach((value: any,index: any)=>{
          if(value==element) this.uplodedfiles.splice(index,1);
      });
    }
}

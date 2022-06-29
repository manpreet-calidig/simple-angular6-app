import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { HttpService } from 'src/app/services/http.service';
import { NgxSpinnerService } from "ngx-spinner";
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';

@Component({
  selector: 'app-editreport',
  templateUrl: './editreport.component.html',
  styleUrls: ['./editreport.component.css']
})
export class EditreportComponent implements OnInit {

  reportForm: any = FormGroup;
  isSubmitted = false;
  message: any = null;
  loading = false
  employeeroles:any
  type:any;
  data:any;
  dataSource:any;
  permission:any;
  id:any;
  idd:any;
  constructor(
    private http:HttpService,
    private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    public datepipe: DatePipe,
    private notifyService : NotificationService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private spinner: NgxSpinnerService,
    private encryptDecryptService: EncryptDecryptService
    ) { }
  ngOnInit() {
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.type = info.type;
    this.idd = info.manager_id;
    this.id=this.route.snapshot.params.id;
    if(info.type == 'user'  || info.type == 'employee'){
      let permissions = this.encryptDecryptService.getPermissions()
      this.permission = this.encryptDecryptService.decryptionHandler(permissions)
    }
    this.reportForm = this.formBuilder.group({
      employee_id: ['', Validators.required],
      description:['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      manager_id: ['']
    });
    this.editReport(this.id)
    this.getTeamList();
  }
  get errorControl() {
    return this.reportForm.controls;
  }
  getTeamList(){
    this.http.get('/teamlist').subscribe((res: any) => {
      this.dataSource = res.data.data;
    })
  }
  editReport(id:any){
    this.http.get('/editreport/'+id).subscribe((res:any) => {
      this.data = res;
      this.reportForm.controls['employee_id'].setValue(this.data.employee_id);
      this.reportForm.controls['description'].setValue(this.data.description);
      this.reportForm.controls['start'].setValue(this.datepipe.transform(this.data.start_date, 'MM/dd/yyyy'));
      this.reportForm.controls['end'].setValue(this.datepipe.transform(this.data.end_date, 'MM/dd/yyyy'));
      this.reportForm.controls['manager_id'].setValue(this.data.manager_id);
      console.log(this.data)
    })
  }


  onSubmit(){
      this.isSubmitted = true;
      this.message = null;
      if(this.reportForm.value.start) {
        this.reportForm.value.start_date = this.datepipe.transform(this.reportForm.value.start, 'yyyy-MM-dd');
      }
      if(this.reportForm.value.end) {
        this.reportForm.value.end_date = this.datepipe.transform(this.reportForm.value.end, 'yyyy-MM-dd');
      }

      if (this.reportForm.invalid) {
        return;
      }
      this.spinner.show();
      this.http.post('/reportupdate/'+this.id,this.reportForm.value).subscribe((res: any) => {
        this.spinner.hide();
      this.notifyService.showSuccess("Report update successfully !!", "Report Updated")
      this.router.navigate(['/report']);
    })
  }
  getPermission(id:any,preid:any){
    let string = this.permission[id];
    if(string.indexOf(preid) !== -1){
      return true
    }
    return false
  }

}

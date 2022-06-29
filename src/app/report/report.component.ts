import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';
import { HttpService } from '../services/http.service';
import { NgxSpinnerService } from "ngx-spinner";
import { EncryptDecryptService } from '../services/encrypt-decrypt.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  reportForm: any = FormGroup;
  isSubmitted = false;
  message: any = null;
  loading = false
  employeeroles:any
  type:any;
  id:any;
  data:any;
  dataSource:any;
  permission:any;
  constructor(
    private http:HttpService,
    private formBuilder: FormBuilder,
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
    this.id=info.manager_id;
    if(info.type == 'user'  || info.type == 'employee'){
      let permissions = this.encryptDecryptService.getPermissions()
      this.permission = this.encryptDecryptService.decryptionHandler(permissions)
    }
    this.reportForm = this.formBuilder.group({
      employee_id: ['', Validators.required],
      description:['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      manager_id: [''],
    });
    this.getTeamList()
  }
  get errorControl() {
    return this.reportForm.controls;
  }
  getTeamList(){
    this.http.get('/teamlist').subscribe((res: any) => {
      this.dataSource = res.data.data;
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
      this.http.post('/addreport', this.reportForm.value).subscribe(res => {
        this.spinner.hide();
      this.notifyService.showSuccess("Report add successfully !!", "Report Added")
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

  reset(){
    this.reportForm.reset();
  }
}

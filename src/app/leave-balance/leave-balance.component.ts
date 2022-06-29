import { DatePipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../notification.service';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-leave-balance',
  templateUrl: './leave-balance.component.html',
  styleUrls: ['./leave-balance.component.css']
})
export class LeaveBalanceComponent implements OnInit {

  leaveForm: any = FormGroup;
   isSubmitted = false;
   message: any = null;
   loading = false
   dataSource:any;
   data:any;
   id:any;

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
    this.leaveForm = this.formBuilder.group({
      user_id: ['', Validators.required],
      id: ['', Validators.required],
      carrired_forward:['', Validators.required],
      entitled: ['', Validators.required],
    });
    this.getemployee();
  }

  getemployee(){
    this.http.get('/employeelist').subscribe((res:any) => {
    this.dataSource = res.data;
  })
}
get errorControl() {
  return this.leaveForm.controls;
}
onChange(event:any){
  this.id = event.target.value;
  this.http.get('/editemployee/'+this.id).subscribe((res:any) => {
    this.data = res;
    this.leaveForm.controls['id'].setValue(this.data.id);
  })
}

onSubmit(){
  //console.log(this.assign_employee)
  this.isSubmitted = true;
  this.message = null;

    if (this.leaveForm.invalid) {
      return;
    }
    this.spinner.show();
    this.http.post('/addleavebalance', this.leaveForm.value).subscribe((res: any) => {
      this.spinner.hide();
      if(res.message == 'Employee already exists for this financial year.') {
        this.notifyService.showError("Employee already exists for this financial year.", "Please edit existing entry instead!")
      } else {
        this.notifyService.showSuccess("Leave Balance add successfully !!", "Leave Balance Added")
      }
      this.router.navigate(['/leave_balance']);
      this.applyActiveClass()
  })
}

reset(){
  this.leaveForm.reset();
  this.router.navigate(['/leave_balance']);
  this.applyActiveClass()
}

applyActiveClass() {
  let leave = document.getElementById('listLeaveBalanceRoute');
  let addleave = document.getElementById('addLeavebalanceRoute')
  leave?.classList.add('active');
  addleave?.classList.remove('active');
}
}

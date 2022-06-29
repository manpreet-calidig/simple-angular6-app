import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';
import { HttpService } from '../services/http.service';
import { LOADERS, NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit {
  leaveForm: any = FormGroup;
  dataSource:any;
  isSubmitted = false;
  message: any = null;
  loading = false
  leaveSource:any;
  bsValue = new Date();
  bsRangeValue: Date[] | undefined;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  day:any;
  disabledDates: any = [];
  constructor(
    private http:HttpService,
    private formBuilder: FormBuilder,
    private notifyService : NotificationService,
    private router: Router,
    public datepipe: DatePipe,
    private spinner: NgxSpinnerService
  ) {
    this.minDate.setDate(this.minDate.getDate() + 0);
    this.maxDate.setDate(this.minDate.getDate() + 60);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

  ngOnInit(): void {
    this.leaveForm = this.formBuilder.group({
      employee_id: ['', Validators.required],
      leave_type:['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      start: ['', Validators.required],
      day: [''],
    });
    this.getEmployeeData();
    this.getLeaveTypeData();
    this.getHolidays();
  }
  get errorControl() {
    return this.leaveForm.controls;
  }
  getEmployeeData(){
      this.http.get('/employeelist').subscribe((res:any) => {
      this.dataSource = res.data;
    })
  }
  getLeaveTypeData(){
    this.http.get('/leave_type').subscribe((res:any) => {
    this.leaveSource = res.data.leavetype.data;
  })
}

updateMyDate(event:any){
  let Time = event[1].getTime() - event[0].getTime();
  let Days = Time / (1000 * 3600 * 24);
  this.day = Days;
}

  onSubmit(){
    this.isSubmitted = true;
      this.message = null;
      if (this.leaveForm.invalid) {
        return;
      }
      if(this.leaveForm.value.start)
      {
        this.leaveForm.value.start_date = this.datepipe.transform(this.leaveForm.value.start[0], 'yyyy-MM-dd');
      }
      if(this.leaveForm.value.start[1])
      {
        this.leaveForm.value.end_date = this.datepipe.transform(this.leaveForm.value.start[1], 'yyyy-MM-dd');
      }
      if(this.leaveForm.value.day == '' && this.leaveForm.value.start_date == this.leaveForm.value.end_date){
        this.leaveForm.value.day = 'fullday';
      }
      this.spinner.show();
      this.http.post('/addleave',this.leaveForm.value).subscribe((res:any) => {
      setTimeout(() =>{
        this.spinner.hide();
        this.router.navigate(['/leave']);
      }, 1000);
      if(res.message == 'You have already applied leave for this date') {
        this.notifyService.showError("You have already applied leave for this date !!", "Apply again with another dates")
      }else {
        this.notifyService.showSuccess("Leave added successfully !!", "Leave Added")
      }
      this.applyActiveClass()
    }, err=> {
      if(err.status == 500) {
        this.spinner.hide();
        this.notifyService.showSuccess("Leave added successfully !!", "Leave Added")
        this.router.navigate(['/leave']);
      }
      console.log(err.status)
    })
  }

  reset(){
    this.leaveForm.reset();
    this.router.navigate(['/leave']);
    this.applyActiveClass()
  }

  applyActiveClass() {
    let leave = document.getElementById('listLeavesRoute');
    let addleave = document.getElementById('addLeaveRoute')
    leave?.classList.add('active');
    addleave?.classList.remove('active');
  }

  getHolidays(){
    let page = 20;
     this.http.get('/holiday?pagevalue='+page).subscribe((res:any) => {
      let holidays = res.data.data;

      holidays.map((e: any)=> {
        if(e.start_date == e.end_date) {
          this.disabledDates.push(new Date(e.start_date));
        } else {
          this.disabledDates.push(new Date(e.start_date));
          this.disabledDates.push(new Date(e.end_date));
        }
      })
     })
  }
}

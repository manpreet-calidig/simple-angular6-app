import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';
import { HttpService } from '../services/http.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-applyleave',
  templateUrl: './applyleave.component.html',
  styleUrls: ['./applyleave.component.css']
})
export class ApplyleaveComponent implements OnInit {
  leaveForm: any = FormGroup;
  dataSource:any;
  isSubmitted = false;
  message: any = null;
  loading = false;
first_name:any;
id:any;
day:any;
bsValue = new Date();
  bsRangeValue: Date[] | undefined;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  start: any ='';
  end: any = '';
  disabledDates: any = [];
leaveSources:any;
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
      leave_type:['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      start: ['', Validators.required],
      status: [''],
      day: [''],
    });
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.first_name = info.first_name;
    this.id = info.id;
    this.leaveForm.controls['status'].setValue('I');
    this.getLeaveTypeData();
    this.getHolidays();
  }

  get errorControl() {
    return this.leaveForm.controls;
  }
  getLeaveTypeData(){
    this.http.get('/leave_type').subscribe((res:any) => {
    this.leaveSources = res.data.leavetype.data;
    console.log(this.leaveSources);
  })
}
updateMyDate(event:any){
    let Time = event[1].getTime() - event[0].getTime();
    let Days = Time / (1000 * 3600 * 24);
    this.day = Days;
    console.log(Days)
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
      this.leaveForm.value.employee_id = this.id;
      this.spinner.show();
      this.http.post('/addleave',this.leaveForm.value).subscribe((res: any) => {
      if(res.message == 'You have already applied leave for this date') {
        this.notifyService.showError("You have already applied leave for this date !!", "Apply again with another dates")
      }else {
        this.notifyService.showSuccess("Leave add successfully !!", "Leave Added")
      }
      setTimeout(() =>{
        this.spinner.hide();
        this.router.navigate(['/applyleave']);
      }, 1000);

    }, err=> {
      if(err.status == 500) {
        this.spinner.hide();
        this.notifyService.showSuccess("Leave added successfully !!", "Leave Added")
        this.router.navigate(['/applyleave']);
      }
      console.log(err.status)
    })
    this.applyActiveClass()
  }

  reset(){
    this.leaveForm.reset();
    this.router.navigate(['/applyleave']);
    this.applyActiveClass()
  }

  applyActiveClass() {
    let leave = document.getElementById('leaveLink');
    let addleave = document.getElementById('addLeaveLink')
    leave?.classList.add('active');
    addleave?.classList.remove('active');
  }

  getHolidays(){
    let page = 20;
     this.http.get('/holiday?pagevalue='+page).subscribe((res:any) => {
      let holidays = res.data.data;
      holidays.map((e: any)=> {
        if(e.start_date != undefined || e.end_date != undefined) {
          if(e.start_date == e.end_date) {
            console.log(new Date(e.start_date))
            this.disabledDates.push(new Date(e.start_date));
          } else {
            this.disabledDates.push(new Date(e.start_date));
            this.disabledDates.push(new Date(e.end_date));
          }
        }
      })
     })
  }
}

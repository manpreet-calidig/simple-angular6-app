import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { HttpService } from 'src/app/services/http.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-editleave',
  templateUrl: './editleave.component.html',
  styleUrls: ['./editleave.component.css']
})
export class EditleaveComponent implements OnInit {
  leaveForm: any = FormGroup;
  dataSource:any;
  isSubmitted = false;
  message: any = null;
  loading = false
  id:any;
  data:any;
  bsValue = new Date();
  bsRangeValue: Date[] | undefined;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  leaveSource:any;
  day: any;
  disabledDates: any = [];
  constructor(private http:HttpService,
    private notifyService : NotificationService,
    private router: Router,
    private route:ActivatedRoute,
    public datepipe: DatePipe,
    private formBuilder: FormBuilder,private spinner: NgxSpinnerService) {
    this.minDate.setDate(this.minDate.getDate() + 0);
    this.maxDate.setDate(this.minDate.getDate() + 60);
    this.bsRangeValue = [this.bsValue, this.maxDate];
    }

  ngOnInit(): void {
    this.id=this.route.snapshot.params.id;
    this.editLeave(this.id);
    this.leaveForm = this.formBuilder.group({
      employee_id: ['', Validators.required],
      leave_type:['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      start: ['', Validators.required],
      day: ['']

    });
    this.getEmployeeData();
    this.getLeaveTypeData();
    this.getHolidays();
  }
  get errorControl() {
    return this.leaveForm.controls;
  }
  editLeave(id:any){
    this.http.get('/editleave/'+id).subscribe((res:any) => {
      this.data = res;
      if(this.data.start_date == this.data.end_date) {
        this.day = 0;
      } else {
        this.day = 1;
      }
      this.leaveForm.controls['employee_id'].setValue(this.data.employee_id);
      this.leaveForm.controls['leave_type'].setValue(this.data.leave_type);
      this.leaveForm.controls['title'].setValue(this.data.title);
      this.leaveForm.controls['description'].setValue(this.data.description);
      this.leaveForm.controls['start'].setValue([this.datepipe.transform(this.data.start_date, 'MM/dd/yyyy'),this.datepipe.transform(this.data.end_date, 'MM/dd/yyyy')]);
      this.leaveForm.controls['day'].setValue(this.data.day);
    })
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
  onUpdate(){
      this.isSubmitted = true;
      this.message = null;
      this.spinner.show();
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
      } else  if(this.leaveForm.value.day == '' || this.leaveForm.value.start_date != this.leaveForm.value.end_date){
        this.leaveForm.value.day = null;
      }
      if(this.leaveForm.value.invalid) {
        if(this.leaveForm.value.start_date == null ||
          this.leaveForm.value.start_date == '' ||
          this.leaveForm.value.end_date == null ||
          this.leaveForm.value.end_date == '' ) {
            this.errorControl.start.errors.required = true;
            this.spinner.hide();
            return;
          } else if(this.leaveForm.value.employee_id) {
            this.errorControl.employee_id.errors.required = true;
            this.spinner.hide();
            return;
          }
          else if(this.leaveForm.value.leave_type) {
            this.errorControl.leave_type.errors.required = true;
            this.spinner.hide();
            return;
          }
          else if(this.leaveForm.value.title) {
            this.errorControl.title.errors.required = true;
            this.spinner.hide();
            return;
          }
          else if(this.leaveForm.value.description) {
            this.errorControl.description.errors.required = true;
            this.spinner.hide();
            return;
          } else {

          }
      }
      this.http.post('/leaveupdate/'+this.id,this.leaveForm.value).subscribe((res: any) => {
      setTimeout(()=> {
        this.spinner.hide();
        this.router.navigate(['/leave']);
      }, 1000);
      if(res.message == 'You have already applied leave for this date') {
        this.notifyService.showError("You have already applied leave for this date !!", "Apply again with another dates")
      }else {
        this.notifyService.showSuccess("Leave updated successfully !!", "Leave Updated")
      }
    }, err=>{
      this.spinner.hide();
      console.log(err, "error")
    })
  }

  updateMyDate(event:any){
    let Time = event[1].getTime() - event[0].getTime();
    let Days = Time / (1000 * 3600 * 24);
    this.day = Days;
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

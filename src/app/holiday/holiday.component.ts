import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';
import { HttpService } from '../services/http.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.css']
})
export class HolidayComponent implements OnInit {
  holidayForm: any = FormGroup;
  dataSource:any;
  isSubmitted = false;
  message: any = null;
  loading = false;
  disabledDates: any = [];
  minDate: Date = new Date();
  constructor(private http:HttpService,
    private formBuilder: FormBuilder,
    private notifyService : NotificationService,
    private router: Router,
    public datepipe: DatePipe,private spinner: NgxSpinnerService) {
      this.minDate.setDate(this.minDate.getDate() + 0);
     }

  ngOnInit(): void {
    this.holidayForm = this.formBuilder.group({
      holiday_type:['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      start: ['', Validators.required],
      end: '',
    });
    this.getHolidays();
  }
  get errorControl() {
    return this.holidayForm.controls;
  }

  onSubmit(){
    this.isSubmitted = true;
    this.message = null;


    if (this.holidayForm.invalid) {
      return;
    }
    if(this.holidayForm.value.start)
    {
      this.holidayForm.value.start_date = this.datepipe.transform(this.holidayForm.value.start[0], 'yyyy-MM-dd');
    }
    if(this.holidayForm.value.start[1])
    {
      this.holidayForm.value.end_date = this.datepipe.transform(this.holidayForm.value.start[1], 'yyyy-MM-dd');

    }

    this.spinner.show();
      this.http.post('/addholiday',this.holidayForm.value).subscribe(res => {
        this.spinner.hide();
      this.notifyService.showSuccess("Holiday add successfully !!", "Holiday Added")
      this.router.navigate(['/holiday']);
    })
  }

  reset(){
    this.holidayForm.reset();
    this.router.navigate(['/holiday']);
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

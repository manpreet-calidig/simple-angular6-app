import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { HttpService } from 'src/app/services/http.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-editholiday',
  templateUrl: './editholiday.component.html',
  styleUrls: ['./editholiday.component.css']
})
export class EditholidayComponent implements OnInit {
  holidayForm: any = FormGroup;
  dataSource:any;
  isSubmitted = false;
  message: any = null;
  loading = false
  id:any;
  data:any;
  constructor(private http:HttpService,
    private notifyService : NotificationService,
    private router: Router,
    private route:ActivatedRoute,
    public datepipe: DatePipe,
    private formBuilder: FormBuilder,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.id=this.route.snapshot.params.id;
    this.editHoliday(this.id);
    this.holidayForm = this.formBuilder.group({
      holiday_type:['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],

    });
  }

  get errorControl() {
    return this.holidayForm.controls;
  }

  editHoliday(id:any){
    this.http.get('/editholiday/'+id).subscribe((res:any) => {
      this.data = res;
      console.log(this.data.holiday_type);
      this.holidayForm.controls['title'].setValue(this.data.title);
      this.holidayForm.controls['description'].setValue(this.data.description);
      this.holidayForm.controls['start'].setValue(this.datepipe.transform(this.data.start_date, 'MM/dd/yyyy'));
      this.holidayForm.controls['end'].setValue(this.datepipe.transform(this.data.end_date, 'MM/dd/yyyy'));
      this.holidayForm.controls['holiday_type'].setValue(this.data.holiday_type);

    })
  }

  onUpdate(){
    this.isSubmitted = true;
      this.message = null;
    console.log(this.holidayForm.value)
      
      if (this.holidayForm.invalid) {
        return;
      }
      if(this.holidayForm.value.start)
      {
        this.holidayForm.value.start_date = this.datepipe.transform(this.holidayForm.value.start, 'yyyy-MM-dd');
      }
      if(this.holidayForm.value.end)
      {
        this.holidayForm.value.end_date = this.datepipe.transform(this.holidayForm.value.end, 'yyyy-MM-dd');
  
      }
      this.spinner.show();
      this.http.post('/holidayupdate/'+this.id,this.holidayForm.value).subscribe((res: any) => {
        this.spinner.hide();
      this.notifyService.showSuccess("Holiday update successfully !!", "Holiday Updated")
      this.router.navigate(['/holiday']);
    })
  }

}

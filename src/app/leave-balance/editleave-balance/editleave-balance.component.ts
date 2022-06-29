import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/notification.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-editleave-balance',
  templateUrl: './editleave-balance.component.html',
  styleUrls: ['./editleave-balance.component.css']
})
export class EditleaveBalanceComponent implements OnInit {
  leaveForm: any = FormGroup;
  dataSource:any;
  isSubmitted = false;
  message: any = null;
  loading = false
  id:any;
  idd:any;
  data:any;
  constructor(private http:HttpService,
    private notifyService : NotificationService,
    private router: Router,
    private route:ActivatedRoute,
    public datepipe: DatePipe,
    private formBuilder: FormBuilder,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.id=this.route.snapshot.params.id;
      
      this.leaveForm = this.formBuilder.group({
        user_id: ['', Validators.required],
      id: ['', Validators.required],
      // first_name: ['', Validators.required],
      carrired_forward:['', Validators.required],
      entitled: ['', Validators.required],
      });
    this.getemployee();
    this.editleavebalance(this.id);
  }
  get errorControl() {
    return this.leaveForm.controls;
  }
  getemployee(){
    this.http.get('/employee').subscribe((res:any) => {
    this.dataSource = res.data.data;
    console.log(this.dataSource);
  })
}
  editleavebalance(id:any){
    this.http.get('/editleavebalance/'+id).subscribe((res:any) => {
      this.data = res;
      this.leaveForm.controls['id'].setValue(this.data.id);
      this.leaveForm.controls['user_id'].setValue(this.data.user_id);
      this.leaveForm.controls['entitled'].setValue(this.data.entitled);
      this.leaveForm.controls['carrired_forward'].setValue(this.data.carrired_forward);
    })
  }
  onChange(event:any){
    this.idd = event.target.value;
    console.log(event.target.value);
    this.http.get('/editemployee/'+this.idd).subscribe((res:any) => {
      this.data = res;
      this.leaveForm.controls['id'].setValue(this.data.id);
    })
  }
  onUpdate(){
    this.isSubmitted = true;
      this.message = null;
      console.log(this.leaveForm.value)

      if (this.leaveForm.invalid) {
        return;
      }
      console.log(this.leaveForm.value)
      this.spinner.show();
      this.http.post('/leavebalanceupdate/'+this.id,this.leaveForm.value).subscribe((res: any) => {

          this.spinner.hide();
          this.notifyService.showSuccess("Leave Balance update successfully !!", "Leave Balance Updated")
          this.router.navigate(['/leave_balance']);
    })
  }
}

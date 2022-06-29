import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../notification.service';
import { HttpService } from '../services/http.service';
import { ConfirmedValidator } from './confirmed.validators';
@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
  form: any = FormGroup;
  isSubmitted = false;
  message: any = null;
  loading = false
  type:any;
  id:any;
  constructor(private http:HttpService,
    private formBuilder: FormBuilder,
    private notifyService : NotificationService,
    private router: Router,
    public datepipe: DatePipe,private spinner: NgxSpinnerService) {

  }

  ngOnInit(): void {
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.type = info.type;
    this.id=info.id;
    this.form = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    }, {
      validator: ConfirmedValidator('password', 'confirm_password')
    })

  }

  get errorControl() {
    return this.form.controls;
  }

  onSubmit(){
    //console.log(this.assign_employee)
    this.isSubmitted = true;
    this.message = null;

    this.form.value.type = this.type;
    this.form.value.id = this.id;
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value);
    this.spinner.show();
      this.http.post('/password', this.form.value).subscribe((res:any) => {
        this.spinner.hide();
        this.notifyService.showSuccess("Password Update successfully !!", "Password Updated")
        this.router.navigateByUrl('/dashboard')
        // this.form.reset();
    })
  }

  onCancelhandler() {
    this.router.navigateByUrl('/dashboard')
  }
}

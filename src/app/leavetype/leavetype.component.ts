import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';
import { HttpService } from '../services/http.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-leavetype',
  templateUrl: './leavetype.component.html',
  styleUrls: ['./leavetype.component.css']
})
export class LeavetypeComponent implements OnInit {
  typeForm: any = FormGroup;
  isSubmitted = false;
  message: any = null;
  loading = false
  constructor( private http:HttpService,
    private formBuilder: FormBuilder,
    private notifyService : NotificationService,
    private router: Router,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.typeForm = this.formBuilder.group({
      leave_type: ['', Validators.required],
    });
  }

  get errorControl() {
    return this.typeForm.controls;
  }
  onSubmit(){
    this.isSubmitted = true;
    this.message = null;
    if (this.typeForm.invalid) {
      return;
    }
    this.spinner.show();
    this.http.post('/addleave_type', this.typeForm.value).subscribe((res: any) => {
      this.spinner.hide();
        this.notifyService.showSuccess("Leave Type add successfully !!", "Leave Type Added")
        this.router.navigate(['/leave/type']);
    })
  }

  reset(){
    this.typeForm.reset();
    this.router.navigate(['/leave/type']);
  }
}

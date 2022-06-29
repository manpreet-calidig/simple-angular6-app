import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { HttpService } from 'src/app/services/http.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-editleavetype',
  templateUrl: './editleavetype.component.html',
  styleUrls: ['./editleavetype.component.css']
})
export class EditleavetypeComponent implements OnInit {
  typeForm: any = FormGroup;
  isSubmitted = false;
  message: any = null;
  loading = false
  id:any;
  data:any;
  constructor(private http:HttpService,
    private notifyService : NotificationService,
    private router: Router,
    private route:ActivatedRoute,
    private formBuilder: FormBuilder,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.id=this.route.snapshot.params.id;

    this.typeForm = this.formBuilder.group({
      leave_type: ['', Validators.required],
    });

    this.editLeaveType(this.id);
  }
  get errorControl() {
    return this.typeForm.controls;
  }
  editLeaveType(id:any){
    this.http.get('/edit_leave_type/'+id).subscribe((res:any) => {
      this.data = res;
      console.log(this.data)
      this.typeForm.controls['leave_type'].setValue(this.data.leave_type);
    })
  }

  onUpdate(){
    this.isSubmitted = true;
    this.message = null;
    if (this.typeForm.invalid) {
      return;
    }
    this.spinner.show();
    this.http.post('/leave_type_update/'+this.id,this.typeForm.value).subscribe((res: any) => {
      this.spinner.hide();
      this.notifyService.showSuccess("Leave Type update successfully !!", "Leave Type Updated")
      this.router.navigate(['/leave/type']);
    })
  }

  reset() {
    this.typeForm.reset()
    this.router.navigate(['/leave/type']);
  }

}

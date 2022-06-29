import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/notification.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-editleaveguidelines',
  templateUrl: './editleaveguidelines.component.html',
  styleUrls: ['./editleaveguidelines.component.css']
})
export class EditleaveguidelinesComponent implements OnInit {
  leaveForm: any = FormGroup;
  dataSource:any;
  isSubmitted = false;
  message: any = null;
  loading = false
  leaveSource:any;
  data:any;
  id:any;
  constructor(
    private http:HttpService,
    private formBuilder: FormBuilder,
    private notifyService : NotificationService,
    private router: Router,
    private route:ActivatedRoute,
    public datepipe: DatePipe,
    private spinner: NgxSpinnerService

  ) { }

  ngOnInit(): void {
    this.id=this.route.snapshot.params.id;
    this.leaveForm = this.formBuilder.group({
      guidelines: ['', Validators.required],
    });
    this.editGuideline(this.id);
  }
  editGuideline(id:any){
    this.http.get('/editguideline/'+id).subscribe((res:any) => {
      this.data = res;
      console.log(this.data.guidelines)
      this.leaveForm.controls['guidelines'].setValue(this.data.guidelines);
    })
  }
  onUpdate(){
    this.isSubmitted = true;
    this.message = null;

    if (this.leaveForm.invalid) {
      return;
    }
    this.spinner.show();
    this.http.post('/guidelineupdate/'+this.id,this.leaveForm.value).subscribe((res: any) => {
      this.spinner.hide();
    this.notifyService.showSuccess("Guideline update successfully !!", "Guideline Updated")
    this.router.navigate(['/guidelines']);
  })
}
  get errorControl() {
    return this.leaveForm.controls;
  }
  reset(){
    this.leaveForm.reset();
  }
}

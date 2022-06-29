import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';
import { HttpService } from '../services/http.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-projecttype',
  templateUrl: './projecttype.component.html',
  styleUrls: ['./projecttype.component.css']
})
export class ProjecttypeComponent implements OnInit {

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
      project_type: ['', Validators.required],
    });
  }
  get errorControl() {
    return this.typeForm.controls;
  }
  onSubmit(){
    this.isSubmitted = true;
    this.message = null;
    console.log('hii');
    if (this.typeForm.invalid) {
      return;
    }
    this.spinner.show();
    this.http.post('/addproject_type', this.typeForm.value).subscribe((res: any) => {
      this.spinner.hide();
        this.notifyService.showSuccess("Project Type add successfully !!", "Project Type Added")
        this.router.navigate(['/project/type']);
    })
  }

  reset(){
    this.typeForm.reset();
  }
}

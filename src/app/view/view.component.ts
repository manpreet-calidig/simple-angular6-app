import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  dataSource:any;
  id:any;
  project_id:any;
  projectId:any;
  client_id:any;
  type:any;
  name:any;
  datetime:any;
  commentForm: any = FormGroup;
  ckeConfig: any;
  // secretCode = "madukkarai";
  decrypted:any;
  isSubmitted = false;
  message: any = null;
  loading = false
  logSource:any;
  constructor(private http:HttpService,
    private route:ActivatedRoute,
    private router: Router,
    public datepipe: DatePipe,
    private formBuilder: FormBuilder,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.id=this.route.snapshot.params.idd;
    this.project_id=this.route.snapshot.params.id;
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.name = info.first_name;
    this.client_id = info.id;
    this.type = info.type;
    this.decript();
    this.getOverviewDetailData();
  this.getLogData();

    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.required],
  })

  this.ckeConfig = {
    filebrowserUploadUrl: environment.apiUrl+'/uploadimage',
    fileTools_requestHeaders :{
      'X-Requested-With': 'XMLHttpRequest'
   },
   filebrowserUploadMethod : 'xhr',
   removeButtons: 'Forms,Iframe,Blocks,Subscript,Superscript,Maximize,Undo',
  };

  this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }
  get errorControl() {
    return this.commentForm.controls;
  }
  decript(){
    this.decrypted = this.id
    this.projectId = this.project_id
  }

  getLogData(){
    this.http.get('/commentlist/'+this.decrypted).subscribe((res:any) => {
      this.logSource = res.data;
      this.logSource.forEach((data:any) => {
        let date = data.created_at;
        data.time = this.datepipe.transform(date, 'dd-MM-yyyy h:mm a');
      })
      console.log(this.logSource);
    })
  }
  getOverviewDetailData(){
    this.http.get('/overview_detail/'+this.decrypted).subscribe((res:any) => {
    this.dataSource = res.data;
    this.datetime = this.datepipe.transform(this.dataSource.created_at, 'dd-MM-yyyy h:mm a');
  })
}
onSubmit(){
  this.isSubmitted = true;
  this.message = null;
 
    if (this.commentForm.invalid) {
      return;
    }
    this.commentForm.value.id = this.decrypted;
    this.commentForm.value.project_id = this.projectId;
    this.commentForm.value.client_id = this.client_id;
    this.commentForm.value.type = this.type;
    this.spinner.show();
    this.http.post('/addcomment', this.commentForm.value).subscribe((res: any) => {
      this.spinner.hide();
      this.getLogData()
      this.commentForm.controls['comment'].setValue('');
    })
}
}

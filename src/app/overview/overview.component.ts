import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../notification.service';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
    isSubmitted = false;
    message: any = null;
    loading = false
    overviewForm: any = FormGroup;
    files:string  []  =  [];
    idd:any;
    id:any;
    type:any;
    url = environment.site+'project/'
    employeeSource:any;
    ckeConfig: any;
    defectlists: any;
    contentHide: any;
    projectsList: any;
    constructor(private http:HttpService,
      private notifyService : NotificationService,
      private router: Router,
      private route:ActivatedRoute,
      public datepipe: DatePipe,
      private spinner: NgxSpinnerService,
      private formBuilder: FormBuilder) { }

    ngOnInit(): void {
      this.idd=this.route.snapshot.params.id;
      let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
      this.id = info.id;
      this.type = info.type;
      this.overviewForm = this.formBuilder.group({
        title: ['', Validators.required],
        // defect: ['', Validators.required],
        // status:['', Validators.required],
        description:['', Validators.required],
        project_id: ['', Validators.required]

    })
    if(this.type != 'client'){
      this.contentHide = "display:none";
    }
    this.ckeConfig = {
      filebrowserUploadUrl: environment.apiUrl+'/uploadimage',
      fileTools_requestHeaders :{
        'X-Requested-With': 'XMLHttpRequest'
    },
    filebrowserUploadMethod : 'xhr',
    removeButtons: 'Forms,Iframe,Blocks,Subscript,Superscript,Maximize,Undo',
    };
    this.getdefect();
    this.getProjects();
  }

  get errorControl() {
    return this.overviewForm.controls;
  }
  onFileChange(event: any)  {
    for  (var i =  0; i <  event.target.files.length; i++)  {
        this.files.push(event.target.files[i]);
    }
  }
  fileUpload(id:any){
    const formData =  new  FormData();
    for  (var i =  0; i <  this.files.length; i++)  {
        formData.append("file[]",  this.files[i]);
    }
    this.http.postImage('/document_overview/'+id, formData).subscribe((res: any) => {
      this.notifyService.showSuccess("Overview add successfully !!", "Overview Added")
    })
  }
  onSubmit(){
    this.isSubmitted = true;
    this.message = null;

      if (this.overviewForm.invalid) {
        return;
      }
      this.loading = true;
      // this.overviewForm.value.idd = this.idd;
      this.overviewForm.value.iddd = this.id;
      this.overviewForm.value.type = this.type;
      this.overviewForm.value.project_id = Number(this.overviewForm.value.project_id)
      this.spinner.show();
      // this.http.post('/addoverview', this.overviewForm.value).subscribe((res: any) => {
      this.http.post('/addDefect', this.overviewForm.value).subscribe((res: any) => {
        this.spinner.hide();
          if(this.files.length > 0){
            this.fileUpload(res.data.id)
          }
          this.http.post('/notifyDefect',{
          'title': this.overviewForm.value.title,
          'description': this.overviewForm.value.description,
          'type': 'P',
          'project_id': this.overviewForm.value.project_id,
          'defect_id': res.data.id
        }).subscribe((response: any)=> {
          this.spinner.hide();
          this.notifyService.showSuccess("Defect added successfully !!", "Defect Added")
          this.router.navigate(['/project/defects_list/']);
        }, error => {
          this.spinner.hide()
          console.log(error)
        })
      }, err=>{
        this.spinner.hide();
        if(err.status == '500'){
          this.notifyService.showSuccess("Defect added successfully !!", "Defect Added")
          this.router.navigate(['/project/defects_list/']);
        }
      })
  }

  getdefect(){
    // this.overviewForm.controls['defect'].setValue(1);
    this.http.get('/defectlist').subscribe((res:any) => {
      this.defectlists = res.data;
    })
  }

  getProjects() {
    // this.overviewForm.controls['project_id'].setValue(0);
    this.http.get('/listRespectiveProjects').subscribe((res:any) => {
      this.projectsList = res.data.data;
    })
  }

  reset(){
    this.overviewForm.reset();
  }
}

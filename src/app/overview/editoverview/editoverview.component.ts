import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { response } from 'express';

@Component({
  selector: 'app-editoverview',
  templateUrl: './editoverview.component.html',
  styleUrls: ['./editoverview.component.css']
})
export class EditoverviewComponent implements OnInit {
  overviewForm: any = FormGroup;
  dataSource:any;
  isSubmitted = false;
  message: any = null;
  loading = false
  files:string  []  =  [];
  uplodedfiles: any;
  id:any;
  data:any;
  idd:any;
  ckeConfig:any;
  url = environment.site+'files/'
  defectlists: any;
  employeeSource:any;
  type:any;
  contentHide:any;
  projectsList:any;
  project_id: any;
  defect_id: any;
  constructor(private http:HttpService,
    private notifyService : NotificationService,
    private router: Router,
    private route:ActivatedRoute,
    public datepipe: DatePipe,
    private formBuilder: FormBuilder,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getdefect();
    this.getProjects();
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.type = info.type;

    if(this.type != 'client'){
      this.contentHide = "display:none";
    }

    this.id=this.route.snapshot.params.id;
    this.idd=this.route.snapshot.params.idd;
    this.overviewForm = this.formBuilder.group({
      title: ['', Validators.required],
      status:['', Validators.required],
      description:['', Validators.required],
      project:['', Validators.required],
      drag_drop_status:['', Validators.required]
    })
    this.ckeConfig = {
      filebrowserUploadUrl: environment.apiUrl+'/uploadimage',
      fileTools_requestHeaders :{
        'X-Requested-With': 'XMLHttpRequest'
     },
     filebrowserUploadMethod : 'xhr',
     removeButtons: 'Forms,Iframe,Blocks,Subscript,Superscript,Maximize,Undo',
    };

  }
  get errorControl() {
    return this.overviewForm.controls;
  }

  editoverview(id:any){
    this.spinner.show()
    this.http.get('/editoverview/'+id).subscribe((res:any) => {
      this.spinner.hide()
      this.data = res;
      this.project_id = this.data.project_id;
      this.defect_id = this.data.id;
      this.getProjectById(this.project_id);
      this.overviewForm.controls['project'].setValue(this.data.project_id);
      this.overviewForm.controls['title'].setValue(this.data.title);
      this.overviewForm.controls['status'].setValue(this.data.status);
      this.overviewForm.controls['description'].setValue(this.data.description);
      this.overviewForm.controls['drag_drop_status'].setValue(this.data.drag_drop_status);

      if(this.data.attachment != '') {
        let uploaddocument = this.data.attachment
        let imagesUpload = uploaddocument.split(',')
        let cleanArray = imagesUpload.filter((s: any) => s.replace(/\s+/g, '').length !== 0)
        this.uplodedfiles = cleanArray
      }

    }, err=> {
      console.log(err)
      this.spinner.hide()
    })
  }
  onUpdate(){
    this.spinner.show();
    this.isSubmitted = true;
    this.message = null;
    this.loading = true;
    this.http.post('/overviewupdate/'+this.id,this.overviewForm.value).subscribe((res: any) => {
        // send notifications to respective users
        this.http.post('/updateNotifyDefect',{
          'title': this.overviewForm.value.title,
          'description': this.overviewForm.value.description,
          'defect_id': this.defect_id,
          'type': 'P'
        }).subscribe((response: any)=> {
          this.spinner.hide();
          this.router.navigate(['/project/defects_list/']);
          this.notifyService.showSuccess("Defect updated successfully !!", "Defect Updated")
        }, error=> {
          this.spinner.hide();
          console.log(error)
        })
    }, err=> {
      this.spinner.hide();
      console.log(err)
    })
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
    if(this.uplodedfiles) {
      let oldfiles = this.uplodedfiles.join(',')
      formData.append("oldfiles",  oldfiles)
    }

    this.http.postImage('/document_overview/'+id, formData).subscribe((res: any) => {
      this.notifyService.showSuccess("Overview update successfully !!", "Overview Updated")
      // this.router.navigate(['/project']);
    })
  }
  RemoveElementFromArray(element: any) {
    this.uplodedfiles.forEach((value: any,index: any)=>{
        if(value==element) this.uplodedfiles.splice(index,1);
    });
  }

  getdefect(){
    this.spinner.show();
    //this.overviewForm.controls['defect'].setValue(1);
    this.http.get('/defectlist').subscribe((res:any) => {
      this.spinner.hide();
      this.defectlists = res.data;
      this.editoverview(this.id);
    }, err=> {
      this.spinner.hide();
      console.log(err);
    })
  }

  getProjects() {
    this.spinner.show();
    // this.overviewForm.controls['project'].setValue(0);
    this.http.get('/listRespectiveProjects').subscribe((res:any) => {
      this.spinner.hide();
      this.projectsList = res.data.data;
    }, err=> {
      this.spinner.hide();
      console.log(err);
    })
  }

  getProjectById(id: any){
    this.spinner.show();
    this.http.get('/getProjectById/'+id).subscribe((res:any) => {
      this.spinner.hide();
      this.overviewForm.controls['project'].setValue(res.project_name);
    }, err=> {
      this.spinner.hide();
      console.log(err);
    })

  }
}

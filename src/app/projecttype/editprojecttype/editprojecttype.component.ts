import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { HttpService } from 'src/app/services/http.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-editprojecttype',
  templateUrl: './editprojecttype.component.html',
  styleUrls: ['./editprojecttype.component.css']
})
export class EditprojecttypeComponent implements OnInit {
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
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.id=this.route.snapshot.params.id;
      
    this.typeForm = this.formBuilder.group({
      project_type: ['', Validators.required],
    });

    this.editProjectType(this.id);
  }

  get errorControl() {
    return this.typeForm.controls;
  }

  editProjectType(id:any){ 
    this.http.get('/edit_project_type/'+id).subscribe((res:any) => {
      this.data = res;
      this.typeForm.controls['project_type'].setValue(this.data.project_type);
    })
  }

  onUpdate(){
    this.isSubmitted = true;
    this.message = null;
    if (this.typeForm.invalid) {
      return;
    }
    this.spinner.show();
    this.http.post('/project_type_update/'+this.id,this.typeForm.value).subscribe((res: any) => {    
      this.spinner.hide();   
      this.notifyService.showSuccess("Project Type update successfully !!", "Project Type Updated")
      this.router.navigate(['/project/type']);
    })
  }
}

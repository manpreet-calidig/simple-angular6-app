import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { HttpService } from 'src/app/services/http.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-editdsr',
  templateUrl: './editdsr.component.html',
  styleUrls: ['./editdsr.component.css']
})
export class EditdsrComponent implements OnInit {
  dsrForm: any = FormGroup;
  dataSource:any;
  projectSource:any;
  isSubmitted = false;
  message: any = null;
  loading = false
  id:any;
  idd:any;
  data:any;
  ckeConfig:any;
  today = new Date();
  date = new Date();
  yesterday = new Date(this.date.setDate(this.date.getDate()-1));
  descriptionMatches: any;
  index1: any;
  timeRequired: any;
  disabledDates: any = [];

  constructor(private http:HttpService,
    private notifyService : NotificationService,
    private router: Router,
    private route:ActivatedRoute,
    public datepipe: DatePipe,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.id=this.route.snapshot.params.id;
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.idd = info.id;
    this.editdsr(this.id);
    this.dsrForm = this.formBuilder.group({
      project:['', Validators.required],
      emp_name:[''],
      //description: ['', Validators.required],
      start: ['', Validators.required],
      //hour: ['', Validators.required],
      items: this.formBuilder.array([ this.createItem() ],
        [Validators.required])
    });
    // this.getEmployeeProject(this.idd);
    this.getProjectData();
     this.ckeConfig = {
      extraPlugins:
        "easyimage,dialogui,dialog,a11yhelp,about,basicstyles,bidi,blockquote,clipboard," +
        "button,panelbutton,panel,floatpanel,colorbutton,colordialog,menu," +
        "contextmenu,dialogadvtab,div,elementspath,enterkey,entities,popup," +
        "filebrowser,find,fakeobjects,flash,floatingspace,listblock,richcombo," +
        "font,format,forms,horizontalrule,htmlwriter,iframe,image,indent," +
        "indentblock,indentlist,justify,link,list,liststyle,magicline," +
        "maximize,newpage,pagebreak,pastefromword,pastetext,preview,print," +
        "removeformat,resize,save,menubutton,scayt,selectall,showblocks," +
        "showborders,smiley,sourcearea,specialchar,stylescombo,tab,table," +
        "tabletools,templates,toolbar,undo,wsc,wysiwygarea"
    };
    this.getHolidays();
  }

  // getEmployeeProject(idd:any){
  //   this.http.get('/employeeproject/'+idd).subscribe((res: any) => {
  //     this.projectSource = res.data.data;
  //     //console.log(res);
  //   })
  // }
  getProjectData(){
    this.http.get('/project').subscribe((res:any) => {
    this.projectSource = res.data.data;
    console.log(res)
  })
}
  createItem(): FormGroup {
    return this.formBuilder.group({
      description: ['', Validators.required],
      hour: ['', Validators.required]
    });
  }
  get errorControl() {
    return this.dsrForm.controls;
  }

  editdsr(id:any){
    this.http.get('/edit_dsr/'+id).subscribe((res:any) => {
      this.data = res;
      this.dsrForm.controls['project'].setValue(this.data.project_id);
      this.dsrForm.controls['emp_name'].setValue(this.data.emp_name);
      //this.dsrForm.controls['description'].setValue(this.data.description);
      for (const x of this.data.items) {
        // this.formArr.push(this.formBuilder.group(x));
        let description = x.description;
        let hour = x.hour;
        this.formArr.push(this.formBuilder.group({
          description : [description, [Validators.required]],
          hour : [hour, [Validators.required]]
        }
        ));
      }

      this.formArr.removeAt(0);
      //this.dsrForm.controls['items'].setValue(this.data.items);
      this.dsrForm.controls['start'].setValue(this.datepipe.transform(this.data.start_date, 'MM/dd/yyyy'));
    })
  }

  onUpdate(){
    this.isSubmitted = true;
    this.message = null;
    // validation tp check if the hour is 0
    // validation check for similar values
    for(var i = 0; i < this.dsrForm.value.items.length; i++) {
      this.index1 = i;
      if(i != this.dsrForm.value.items.length-1) {
        if(this.dsrForm.value.items[i].description == this.dsrForm.value.items[i+1].description) {
          this.descriptionMatches = true
          return;
        } else {
          this.descriptionMatches = false;
        }
      }
      else {
        this.descriptionMatches = false;
      }
      if(this.dsrForm.value.items[i].hour == 0) {
        this.timeRequired = true
        return
      } else {
        this.timeRequired = false
      }
    }

    if (this.dsrForm.invalid) {
      return;
    }
    if(this.dsrForm.value.start)
    {
      this.dsrForm.value.start_date = this.datepipe.transform(this.dsrForm.value.start, 'yyyy-MM-dd');
    }
    this.spinner.show();
    this.http.get('/checkLeave/'+this.dsrForm.value.start_date+'/'+this.id).subscribe((res: any)=> {
      this.spinner.hide();
      let leavestatus = res.data.employeeOnLeave;
      if(leavestatus == true) {
        this.notifyService.showError("You are on leave today!!", "No DSR Added")
        this.router.navigate(['/dsr']);
      } else {
        this.http.post('/dsr_update/'+this.id,this.dsrForm.value).subscribe((res: any) => {
          this.spinner.hide();
          let msg = res.message
                console.log(msg, "msg")
                if(msg == 'DSR has already been filled') {
                  this.notifyService.showError("DSR has already been filled for this date!!", "No DSR Added")
                } else if (msg == 'Total hours must be >= 9') {
                  this.notifyService.showError("Total working hours must be more than or equal to 9", "No DSR Added")
                } else if (msg == 'Total hours must be >= 4') {
                  this.notifyService.showError("Total working hours must be more than or equal to 4", "No DSR Added")
                } else if (msg == 'Total hours can be <= 15') {
                  this.notifyService.showError("Total working hours cannot be more than 15", "No DSR Added")
                }
                 else {
                  this.notifyService.showSuccess("Daily report update successfully !!", "Daily report Updated")
                 }
                  this.router.navigate(['/dsr']);
              })
            }
        })
      }
  get formArr() {
    return this.dsrForm.get('items') as FormArray;
  }
  addAddress() {
    //this.items = this.dsrForm.get('items') as FormArray;
    this.formArr.push(this.createItem());
  }
  removeAddress(i: number) {
    //console.log(this.createItem);
    this.formArr.removeAt(i);
  }

  getHolidays(){
    let page = 20;
     this.http.get('/holiday?pagevalue='+page).subscribe((res:any) => {
      let holidays = res.data.data;

      holidays.map((e: any)=> {
        if(e.start_date == e.end_date) {
          this.disabledDates.push(new Date(e.start_date));
        } else {
          this.disabledDates.push(new Date(e.start_date));
          this.disabledDates.push(new Date(e.end_date));
        }
      })
     })
  }
}

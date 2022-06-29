import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';
import { HttpService } from '../services/http.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-dsr',
  templateUrl: './dsr.component.html',
  styleUrls: ['./dsr.component.css']
})
export class DsrComponent implements OnInit {
  date = new Date();
  today = new Date();
  yesterday = new Date(this.date.setDate(this.date.getDate()-1));

  dsrForm: any = FormGroup;
  id:any;
  projectSource:any;
  isSubmitted = false;
  message: any = null;
  loading = false
  ckeConfig:any;
  timeRequired = false;
  index1: any;
  descriptionMatches = false;
  disabledDates: any = [];
  public addmore: any[] = [{
    description: '',
    hour: ''
  }];
  items: FormArray | undefined;

  constructor(private http:HttpService,
    private formBuilder: FormBuilder,
    private notifyService : NotificationService,
    private router: Router,
    public datepipe: DatePipe,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.id = info.id;
    this.dsrForm = this.formBuilder.group({
      project:['', Validators.required],
      //description: ['', Validators.required],
      start: ['', Validators.required],
      //hour: ['', Validators.required],
      items: this.formBuilder.array(
        [ this.createItem() ],
      [Validators.required])
    });
    this.getEmployeeProject(this.id);
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


  createItem(): FormGroup {
    return this.formBuilder.group({
      description: ['', Validators.required],
      hour: ['', Validators.required],
    });
  }
  get errorControl() {
    return this.dsrForm.controls;
  }

  getEmployeeProject(id:any){
    this.http.get('/employeeproject/'+id).subscribe((res: any) => {
      this.projectSource = res.data.data;
    })
  }

  onSubmit(){
    this.isSubmitted = true;
    this.message = null;

    // validation to check if the hour is 0
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
      if(this.dsrForm.value.items[i].hour === 0) {
        this.timeRequired = true
        return
      } else {
        this.timeRequired = false
      }
    }
    if (this.dsrForm.invalid) {
      console.log(this.dsrForm);
      return;
    }
    if(this.dsrForm.value.start)
    {
      this.dsrForm.value.start_date = this.datepipe.transform(this.dsrForm.value.start, 'yyyy-MM-dd');
    }

    this.dsrForm.value.user_id = this.id;
    this.spinner.show();
    this.http.get('/checkLeave/'+this.dsrForm.value.start_date+'/'+this.id).subscribe((res: any)=> {
      this.spinner.hide();
      let leavestatus = res.data.employeeOnLeave;
      if(leavestatus == true) {
        this.notifyService.showError("You are on leave today!!", "No DSR Added")
      } else {
          this.spinner.show();
          this.http.post('/add_dsr',this.dsrForm.value).subscribe((res: any) => {
            this.spinner.hide();
            let msg = res.message
            if(msg == 'DSR has already been filled') {
              this.notifyService.showError("DSR has already been filled for this date!!", "No DSR Added")
            } else if (msg == 'Total hours must be >= 9') {
              this.notifyService.showError("Total working hours must be more than or equal to 9", "No DSR Added")
            } else if (msg == 'Total hours must be >= 4') {
              this.notifyService.showError("Total working hours must be more than or equal to 4", "No DSR Added")
            }else if (msg == 'Total hours can be <= 15') {
              this.notifyService.showError("Total working hours cannot be more than 15", "No DSR Added")
            }
             else {
              this.notifyService.showSuccess("DSR add successfully !!", "DSR Added")
            }
        })
      }
    })
    this.router.navigate(['/dsr']);
    this.setActiveClass();
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

  reset(){
    this.dsrForm.reset();
    this.router.navigate(['/dsr']);
    this.setActiveClass();
  }

  setActiveClass() {
    let dsr = document.getElementById('listDSR');
    let adddsr = document.getElementById('addDSR')
    dsr?.classList.add('active');
    adddsr?.classList.remove('active');
  }

  ValidHoursHandler(evt: any) {
    let hours = evt.target.value;
    if(hours === 0 ) {
      this.timeRequired = true
    } else {
      this.timeRequired = false
    }
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

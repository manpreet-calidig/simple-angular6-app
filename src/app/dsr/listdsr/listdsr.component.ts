import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2'
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/notification.service';
import { Observable } from 'rxjs';
import { data } from 'jquery';

@Component({
  selector: 'app-listdsr',
  templateUrl: './listdsr.component.html',
  styleUrls: ['./listdsr.component.css']
})
export class ListdsrComponent implements OnInit {
  dsrForm: any = FormGroup;
  today = new Date();
  // yesterday = new Date(this.today.setDate(this.today.getDate()-1));

  dataSource:any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20];
  showModal: boolean = false;
  content: any = '';
  type:any;
  userid:any;
  user_id:any;
  project:any;
  employee:any;
  isSubmitted = false;
  message: any = null;
  buttonType:any;
  date = moment();
  link:any;
  excel:any;
  dateInFormat = this.date.format('YYYY-MM-DD');
  people$: any = [];
  selectedPersonId = '5a15b13c36e7a7f00cf0d7cb';
  length:any;
  masterSelected: boolean;
  isSelected:any
  checkedList:any
  id:any = [];
  showOptions= false;
  showDate: any
  constructor(private http:HttpService,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private httpClient:HttpClient,
    private notifyService: NotificationService,
    ) {this.masterSelected = false; }

  ngOnInit(): void {
    console.log(this.dateInFormat)
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.type = info.type
    this.getDsrData(this.page);
    this.dsrForm = this.formBuilder.group({
      project:[''],
      employee:[''],
      start:[''],
    });
    this.getProjectData();
    this.getEmployeeData();
  }

  getDsrData(id:any){
    this.http.get('/dsr?page='+id).subscribe((res:any) => {
    this.dataSource = res.data.data;
    let date = new Date;
    let month = date.getMonth()+1;
    let day = date.getDate()-1;
    let year = date.getFullYear();
    let fulldate = year+'-'+month+'-'+day;

    if(day.toString().length === 1) {
      fulldate = year+'-'+month+'-'+0+day;
      if(month.toString().length === 1) {
        fulldate = year+'-'+0+month+'-'+0+day;
      } else {
        fulldate = year+'-'+0+month+'-'+day;
      }
    } else {
      if(month.toString().length === 1) {
        fulldate = year+'-'+0+month+'-'+day;
      }
    }
    this.showDate = fulldate;
    this.count = res.data.total;
    let length = this.dataSource.length
      if(length == 0){
        this.length = 0;
      }else{
        this.length = 1;
      }
    if(this.dataSource != ''){
      this.link = res.data.data[0].links;
      this.excel = res.data.data[0].excel;
    }else{
      this.link = '';
      this.excel = '';
    }
  })
}

getProjectData(){
  this.http.get('/listProjects').subscribe((res:any) => {
  this.project = res.data;
  this.people$ = res.data;
})
}

getEmployeeData(){
  this.http.get('/employee').subscribe((res:any) => {
  this.employee = res.data.data;
  if(this.type == 'client') {
    this.employee = res.data;
  }
})
}

checkUncheckAll(){
  for (var i = 0; i < this.dataSource.length; i++) {
    this.dataSource[i].isSelected = this.masterSelected;
  }
  this.getCheckedItemList();
}
isAllSelected() {
  this.masterSelected = this.dataSource.every(function(item:any) {
      return item.isSelected  == true;
    })
    this.getCheckedItemList();
}
getCheckedItemList(){
  this.checkedList = [];
  for (var i = 0; i < this.dataSource.length; i++) {
    if(this.dataSource[i].isSelected)
    this.checkedList.push(this.dataSource[i]);
  }
  for(let checked of this.checkedList)
  {
    this.id.push(checked.id);
  }
}
onSubmit(){
  this.isSubmitted = true;
    this.message = null;

    if(this.dsrForm.value.start[0])
    {
      this.dsrForm.value.start_date = this.datepipe.transform(this.dsrForm.value.start[0], 'yyyy-MM-dd');
    }
    if(this.dsrForm.value.start[1])
    {
      this.dsrForm.value.end_date = this.datepipe.transform(this.dsrForm.value.start[1], 'yyyy-MM-dd');
    }
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.type = info.type
    if(this.type=='employee' || this.type=='client'){
      this.dsrForm.value.user_id = info.id;
    }else{
      this.dsrForm.value.user_id = '';
    }
    this.http.post('/dsrfilter',this.dsrForm.value).subscribe((res:any) => {
          this.dataSource = res.data.data;
          let length = this.dataSource.length
      if(length == 0){
        this.length = 0;
      }else{
        this.length = 1;
      }
          if(this.dataSource != ''){
            this.link = res.data.data[0].links;
            this.excel = res.data.data[0].excel;
          }else{
            this.link = '';
            this.excel = '';
          }
          console.log(res);
        })
}

onTableDataChange(event: number){
  this.page = event;
  this.getDsrData(this.page);
}
deleteData(id: string){
  Swal.fire({
    title: 'Are you sure want to remove?',
    text: 'You will not be able to recover this file!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.value) {
      this.http.get('/dsr_delete/'+id).subscribe((data: any) => {
            this.getDsrData(this.page);
      }, err => {
           console.log(err);
      })
      Swal.fire(
        'Deleted!',
        'Your imaginary file has been deleted.',
        'success'
      )
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Your imaginary file is safe :)',
        'error'
      )
    }
  })
  }
  show(content: any) {
    console.log(content)
    this.content = content
    this.showModal = true; // Show-Hide Modal Check
  }
  hide() {
    this.showModal = false;
  }

  testfunction(data: any) {
    const newdate = new Date(data);
    return moment(newdate).format('DD-MMM-YYYY');
  }

  approveDSR(id: any) {
    Swal.fire({
      title: 'Make sure to check the details of DSR before approval!',
      text: 'Click yes to proceed!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'No, I want to see details first.'
    }).then((result) => {
      if (result.value) {
        this.http.post('/approve_dsr', {id}).subscribe((res:any) => {
              this.getDsrData(this.page);
            }, err => {
             console.log(err);
        })
        Swal.fire(
          'Approved!',
          'Respective DSR has been approved!',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'DSR saving back with approval :)',
          'error'
        )
      }
    })
  }

  getStartDate(evt: any) {
    console.log(evt.target.value, "data")
  }

  items = [
    {id: 1, name: 'Python'},
    {id: 2, name: 'Node Js'},
    {id: 3, name: 'Java'},
    {id: 4, name: 'PHP', disabled: true},
    {id: 5, name: 'Django'},
    {id: 6, name: 'Angular'},
    {id: 7, name: 'Vue'},
    {id: 8, name: 'ReactJs'},
  ];
  selected = [
    {id: 2, name: 'Node Js'},
    {id: 8, name: 'ReactJs'}
  ];
}

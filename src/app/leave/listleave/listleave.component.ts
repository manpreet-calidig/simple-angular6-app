import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/notification.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-listleave',
  templateUrl: './listleave.component.html',
  styleUrls: ['./listleave.component.css']
})
export class ListleaveComponent implements OnInit {
  statusForm: any = FormGroup;
  leaveForm: any = FormGroup;

  dataSource:any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20];
  url = environment.site+'client/'
  permission: any
  showModal:any;
  LeaveModal:any;
  content:any;
  isSubmitted = false;
  message: any = null;
  loading = false
  id:any;
  employee_id:any;
  leaveinfo:any = '';
  balance: any = 0;
  applyleave: any= 0;
  monthleave: any= 0;
  weakleave: any= 0;
  todayleavecount: any = 0;
  today: any = '';
date:any;
allleave: any;
 menutitle = '<strong>All</strong> Leaves';
  leaveStatusUpdates: any;
  length:any;
  constructor(private http:HttpService,
    private formBuilder: FormBuilder,
    private notifyService : NotificationService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService
    ) {
      this.activatedRoute.queryParams.subscribe(res=>{
        this.today = res.today;
      })
    }

  ngOnInit(): void {
    this.getLeaveData(this.page);
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if(info.type == 'user'  || info.type == 'employee'){
      let permissions = this.encryptDecryptService.getPermissions()
      this.permission = this.encryptDecryptService.decryptionHandler(permissions)
    }
    this.statusForm = this.formBuilder.group({
      status: ['', Validators.required],
      comment: ['', Validators.required],
      id: [''],
    });

    this.leaveForm = this.formBuilder.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
      search: [''],
      date: ['']
    });
  }

  get errorControl() {
    return this.statusForm.controls;
  }
  get errorControl1() {
    return this.leaveForm.controls;
  }
  onTableDataChange(event: number){
    this.page = event;
    this.getLeaveData(this.page);
  }
  leaveRequested(){
    this.leaveForm.value.date = 'requested';
    this.http.post('/leavefilter',this.leaveForm.value).subscribe((res:any) => {
      this.dataSource = res.data.data;
      let length = this.dataSource.length
  if(length == 0){
    this.length = 0;
  }else{
    this.length = 1;
  }
      console.log(res);
    })
  }
  getweakrecord(){
    this.leaveForm.value.date = 'weak';
    this.http.post('/leavefilter',this.leaveForm.value).subscribe((res:any) => {
      this.dataSource = res.data.data;
      let length = this.dataSource.length
      if(length == 0){
        this.length = 0;
      }else{
        this.length = 1;
      }
          console.log(res);
      })
  }
  getmonthrecord(type: any){
    if(type == 'month') {
      this.menutitle = '<strong>Current</strong> Month';
    }else if(type == 'week') {
      this.menutitle = '<strong>Current </strong> Week';
    }else if(type == 'requested') {
      this.menutitle = '<strong>All</strong> Requested Leaves';
    }else if(type == 'today') {
      this.menutitle = "<strong>Today's </strong> Leaves";
    }else{
      this.menutitle = '<strong>All</strong> Leaves';
    }


    this.leaveForm.value.date = type;
    this.http.post('/leavefilter',this.leaveForm.value).subscribe((res:any) => {
      this.dataSource = res.data.leave.data;
      let length = this.dataSource.length
      this.count = res.data.leave.total;
      if(length == 0){
        this.length = 0;
      }else{
        this.length = 1;
      }
          console.log(res);
        })
      }
  onSearch(){
    this.menutitle = '<strong>All </strong> Leaves';
    this.isSubmitted = true;
    this.message = null;
    // if (this.leaveForm.invalid) {
    // console.log(this.leaveForm.value)

    //   return;
    // }
    if(this.leaveForm.value.start)
    {
      this.leaveForm.value.start_date = this.datepipe.transform(this.leaveForm.value.start, 'yyyy-MM-dd');
    }
    if(this.leaveForm.value.end)
    {
      this.leaveForm.value.end_date = this.datepipe.transform(this.leaveForm.value.end, 'yyyy-MM-dd');
    }
    console.log(this.leaveForm.value)
    this.http.post('/leavefilter',this.leaveForm.value).subscribe((res:any) => {
      this.dataSource = res.data.leave.data;
      let length = this.dataSource.length
      this.count = res.data.leave.total;
  if(length == 0){
    this.length = 0;
  }else{
    this.length = 1;
  }
      console.log(res);
    })
  }
  getLeaveData(id:any){
      if(this.today == undefined) {
        this.today = '';
      }
      this.http.get('/leave?page='+id+'&today='+this.today).subscribe((res:any) => {
      this.dataSource = res.data.leave.data;
      this.applyleave = res.data.apply;
      this.weakleave = res.data.weakleave;
      this.monthleave = res.data.monthleave;
      this.todayleavecount = res.data.todayleavecount;
      this.allleave = res.data.allleave;

      let length = this.dataSource.length
      if(length == 0){
        this.length = 0;
      }else{
        this.length = 1;
      }
      this.count = res.data.leave.total;
      console.log(res);
    })
  }

  pageValue(event:any){
    let page = event.target.value
     this.http.get('/leave?pagevalue='+page).subscribe((res:any) => {
      this.dataSource = res.data.leave.data;
      let length = this.dataSource.length
      this.count = res.data.leave.total;
      this.tableSize = page
      this.tableSizes = [page]
      if(length == 0){
        this.length = 0;
      }else{
        this.length = 1;
      }
          console.log(res);
        })
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

        this.http.get('/leavedelete/'+id).subscribe((data: any) => {
              this.getLeaveData(this.page);
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

    getPermission(id:any,preid:any){
      let string = this.permission[id];
      if(string.indexOf(preid) !== -1){
        return true
      }
      return false
    }

    show(content: any) {
      this.id = content.id
      this.employee_id = content.employee_id;
      this.showModal = true; // Show-Hide Modal Check
    }

    showLeaveInfo(content: any) {
      //console.log(content);
      //return false
      this.leaveinfo = content;
      this.balance = content.balance.entitled + content.balance.carrired_forward;
      this.LeaveModal = true;

    }

    hide() {
      this.showModal = false;
      this.LeaveModal = false;
    }

    onSubmit()
    {
      this.isSubmitted = true;
      this.message = null;

      if (this.statusForm.invalid) {
        return;
      }
        this.statusForm.value.id = this.id;
        this.statusForm.value.employee_id = this.employee_id;
        this.spinner.show();
        this.http.post('/leavestatus',this.statusForm.value).subscribe((res:any) => {
          this.spinner.hide();
          if(res.data.status == 'A' || res.data.status == 'AU') {
            this.leaveStatusUpdates = 'Your leave has been approved!'
          } else {
            this.leaveStatusUpdates = 'Your leave has been rejected!'
          }
          this.notifyService.showSuccess("Status Update successfully !!", "Status Updated")
          this.getLeaveData(this.page);
          this.statusForm.reset()
          this.hide();

      },err=> {
        this.spinner.hide();
        if(err.status == 500) {
          this.notifyService.showSuccess("Status Update successfully !!", "Status Updated")
          this.getLeaveData(this.page);
        }
        this.showModal = false;
        console.log(err.status)
        this.statusForm.reset()
      })
    }

    testfunction(data: any) {
      //alert(data);
      const newdate = new Date(data);
      return moment(newdate).format('DD-MMM-YYYY');
    }
}

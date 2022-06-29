import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/notification.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-applyleavelist',
  templateUrl: './applyleavelist.component.html',
  styleUrls: ['./applyleavelist.component.css']
})
export class ApplyleavelistComponent implements OnInit {
  statusForm: any = FormGroup;
  dataSource:any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20];
  id:any;
  content:any;
  employee_id: any;
  showModal: any = false;
  showModal1: any = false;
  isSubmitted = false;
  message: any = null;
  loading = false;
  total_count: any;
  balance:any;
  usedleavebalance:any;
  available:any;
  length:any;
  yearto: any;
  total: any;
  carried: any;
  total_availed: any;
  remaining: any;
  unpaid_leaves: any;
  constructor(private http:HttpService,private formBuilder: FormBuilder,private spinner: NgxSpinnerService,private notifyService : NotificationService,private router: Router) { }

  ngOnInit(): void {
    // if(this.router.url == '/applyleave') {
    //   window.location.reload();
    // }
    console.log(this.router.url);
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.id = info.id;
    this.getLeaveData(this.id);
    this.statusForm = this.formBuilder.group({
      status: ['', Validators.required],
      id: [''],
    });
    this.getCount();
  }
  onTableDataChange(event: number){
    this.page = event;
    this.getLeaveData(this.id);
  }
  getLeaveData(id:any){
      this.http.get('/employeeleaves/'+id).subscribe((res:any) => {
      this.dataSource = res.data.data;
      this.count = res.data.data.length;
      let length = this.dataSource.length
      if(length == 0){
        this.length = 0;
      }else{
        this.length = 1;
      }
      this.total_count = res.data.total
      console.log(this.count);
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
              this.getLeaveData(this.id);
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
      this.id = content.id
      this.employee_id = content.employee_id;
      this.showModal = true; // Show-Hide Modal Check
    }
    hide() {
      this.showModal = false;
    }
    showing(content: any) {
      console.log(content)
      this.content = content
      this.showModal1 = true; // Show-Hide Modal Check

    }
    //Bootstrap Modal Close event
    hidden() {
      this.showModal1 = false;
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
        this.http.post('/leavestatus',this.statusForm.value).subscribe(res => {
          this.spinner.hide();
          this.notifyService.showSuccess("Status Update successfully !!", "Status Updated")
          this.hide();
          this.getLeaveData(this.employee_id)
      });
    }
    getCount() {
      this.http.get('/dashboard').subscribe((res:any) => {
        this.balance = res.data.balance
        this.usedleavebalance = res.data.usedleavebalance
        this.available = this.balance-this.usedleavebalance;
        this.yearto = res.data.yearto
        this.total = res.data.total
        this.total_availed = res.data.total_availed
        this.remaining = res.data.remaining
        this.unpaid_leaves = res.data.unpaid_leaves
      });
    }
    nextPage(page: any) {
      this.router.navigate([page]);
    }
    get errorControl() {
      return this.statusForm.controls;
    }
    testfunction(data: any) {
      //alert(data);
      const newdate = new Date(data);
      return moment(newdate).format('DD-MMM-YYYY');
    }
}

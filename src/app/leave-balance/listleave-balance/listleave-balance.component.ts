import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listleave-balance',
  templateUrl: './listleave-balance.component.html',
  styleUrls: ['./listleave-balance.component.css']
})
export class ListleaveBalanceComponent implements OnInit {
  dataSource:any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20];
  leaveForm: any = FormGroup;
  isSubmitted = false;
  message: any = null;
  loading = false
  year:any;
  array:any=[];
  c:any;
  currentyear:any;
  length:any;
  constructor(
    private http:HttpService,
    private router: Router,
    private formBuilder: FormBuilder,

    ) { }

  ngOnInit(): void {
    this.getLeaveBalance(this.page);
    this.leaveForm = this.formBuilder.group({
      search: ['', Validators.required]
    });
    this.years()
  }

  get errorControl() {
    return this.leaveForm.controls;
  }

  years(){
    for (let i = 1; i <= 30; i++) {
      let d = i+1
      let next = 20+d;
      let final= 2020+i;
      this.c = final + '-' + next
      this.array.push(this.c);
    }
  }

  onSubmit(){
    let search = this.leaveForm.value.search
    this.http.get('/leavebalance?search='+search).subscribe((res:any) => {
      this.dataSource = res.data.data;
      let length = this.dataSource.length
      this.count = res.data.total;
  if(length == 0){
    this.length = 0;
  }else{
    this.length = 1;
  }
      console.log(res);
    })
  }
onChange(event:any)
{
  let value = event.target.value;
  this.year = value.split("-")[0];

  this.http.get('/leavebalance?year='+this.year).subscribe((res:any) => {
    this.dataSource = res.data.data;
    this.count = res.data.total;
    let length = this.dataSource.length
    if(length == 0){
      this.length = 0;
    }else{
      this.length = 1;
    }
    console.log(res);
  })
}
pageValue(event:any){
  let page = event.target.value
   this.http.get('/leavebalance?pagevalue='+page).subscribe((res:any) => {
    this.dataSource = res.data.data;
    let length = this.dataSource.length
    this.count = res.data.total;
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
  onTableDataChange(event: number){
    this.page = event;
    this.getLeaveBalance(this.page);
  }
  getLeaveBalance(id:any){
      this.http.get('/leavebalance?page='+id).subscribe((res:any) => {
      this.dataSource = res.data.data;
      this.count = res.data.total;
      let length = this.dataSource.length
      if(length == 0){
        this.length = 0;
      }else{
        this.length = 1;
      }
      for(let year of this.dataSource){
        console.log(year)
        let date = year.currentyear
        let next = date % 100 + 1;
        let final = date  + '-' + next
        this.currentyear = final
      }
    })
  }

  sorting(id:any){

    const sortby = '';
    if(localStorage.getItem("sortid") == '') {
      const sortby = 'ASC'
    }else {
      if(localStorage.getItem("sortid") == id) {
        if(localStorage.getItem("sortby") == 'ASC') {
          const sortby = 'DESC'
        }else if(localStorage.getItem("sortby") == 'DESC') {
          const sortby = 'ASC'
        }
      }else {
        const sortby = 'DESC'
      }
    }

    let sortid = localStorage.setItem("sortid", id);
    const sortbyus = localStorage.setItem("sortby", sortby);


    this.http.get('/leavebalance?page='+this.page+'&sortid='+localStorage.getItem("sortid")+'&sortby='+localStorage.getItem("sortby")).subscribe((res:any) => {
    this.dataSource = res.data.data;
    this.count = res.data.total;
    let length = this.dataSource.length
    if(length == 0){
      this.length = 0;
    }else{
      this.length = 1;
    }
    for(let year of this.dataSource){
      this.currentyear = year.currentyear;
    }
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

        this.http.get('/leavebalancedelete/'+id).subscribe((data: any) => {
              this.getLeaveBalance(this.page);
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
}

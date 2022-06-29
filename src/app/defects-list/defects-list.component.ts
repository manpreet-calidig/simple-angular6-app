import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-defects-list',
  templateUrl: './defects-list.component.html',
  styleUrls: ['./defects-list.component.css']
})
export class DefectsListComponent implements OnInit {
  defectForm: any = FormGroup;

  dataSource:any;
  employeeSource:any;
  clientSource:any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20];
  type:any;
  id:any;
  url = environment.site+'client/'
  permission: any


  // secretCode = "madukkarai";
  length:any;
  encrypted:any;
  decrypted:any;
  idd:any;
  constructor(private http:HttpService,
    private router: Router,
    private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.type = info.type;
    this.id = info.id;
    // this.getEmployeeProject(this.id);
    this.getClientProject(this.id);
    this.getProjectData(this.page);
    if(info.type == 'user'  || info.type == 'employee'){
      this.permission = info.permission
    }
    this.defectForm = this.formBuilder.group({
      search: ['']
    });
  }

overview(id:any){
    this.router.navigate(['/project/overview/'+id]);
}

  onTableDataChange(event: number){
    this.page = event;
    this.getProjectData(this.page);
  }
  getProjectData(id:any){
      this.http.get('/overviewDefectsList?page='+id).subscribe((res:any) => {
      this.dataSource = res.data.data;
      let length = this.dataSource.length
      if(length == 0){
        this.length = 0;
      }else{
        this.length = 1;
      }
      this.count = res.data.total;
    })
  }
  pageValue(event:any){
    let page = event.target.value
     this.http.get('/overviewDefectsList?pagevalue='+page).subscribe((res:any) => {
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
  onSubmit(){
    console.log(this.defectForm.value)
    let search = this.defectForm.value.search
    this.http.get('/overviewDefectsList?search='+search).subscribe((res:any) => {
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
  // getEmployeeProject(id:any){
  //   this.http.get('/overviewDefectsList').subscribe((res:any) => {
  //   this.employeeSource = res.data.data;
  //   this.count = res.data.total;
  //   })
  // }
  getClientProject(id:any){
    this.http.get('/clientproject/'+id).subscribe((res: any) => {
      this.clientSource = res.data.data;
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

        this.http.get('/projectdelete/'+id).subscribe((data: any) => {
              this.getProjectData(this.page);
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



}

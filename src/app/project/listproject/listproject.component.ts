
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';


@Component({
  selector: 'app-listproject',
  templateUrl: './listproject.component.html',
  styleUrls: ['./listproject.component.css']
})
export class ListprojectComponent implements OnInit {
  projectForm: any = FormGroup;

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
  length:any;
  clientlength:any;
  employeelength:any;

  // secretCode = "madukkarai";

  encrypted:any;
  decrypted:any;
  idd:any;
  constructor(private http:HttpService,
    private router: Router,
    private formBuilder: FormBuilder,
    private encryptDecryptService: EncryptDecryptService
    ) {}
  ngOnInit(): void {
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.id = info.id;
    if(info.role == '1')
    {
      this.type = 'user';
    }else{
      this.type = info.type;
    }
    this.projectForm = this.formBuilder.group({
      search: ['']
    });
    this.getEmployeeProject(this.id);
    this.getClientProject(this.id);
    this.getProjectData(this.page);
    if(info.type == 'user'  || info.type == 'employee'){
      let permissions = this.encryptDecryptService.getPermissions()
      this.permission = this.encryptDecryptService.decryptionHandler(permissions)
    }
  }

overview(id:any){
    this.router.navigate(['/project/overview/'+id]);
}

  onTableDataChange(event: number){
    this.page = event;
    this.getProjectData(this.page);
  }
  getProjectData(id:any){
      this.http.get('/project?page='+id).subscribe((res:any) => {
      this.dataSource = res.data.data;
      this.count = res.data.total;
      let length = this.dataSource.length
        if(length == 0){
          this.length = 0;
        }else{
          this.length = 1;
        }
    })
  }
  getEmployeeProject(id:any){
    this.http.get('/employeeproject/'+id).subscribe((res: any) => {
      this.employeeSource = res.data.data;
      let length = this.employeeSource.length
        if(length == 0){
          this.employeelength = 0;
        }else{
          this.employeelength = 1;
        }
    })
  }
  getClientProject(id:any){
    this.http.get('/clientproject/'+id).subscribe((res: any) => {
      this.clientSource = res.data.data;
      let length = this.clientSource.length
      if(length == 0){
        this.clientlength = 0;
      }else{
        this.clientlength = 1;
      }
    })
  }
  pageValue(event:any){
    let page = event.target.value
    let id = this.id;
    if(this.type=='user'){
      this.http.get('/project?pagevalue='+page).subscribe((res:any) => {
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
    }else if(this.type=='employee'){
      this.http.get('/employeeproject/'+id+'?pagevalue='+page).subscribe((res:any) => {
        this.employeeSource = res.data.data;
        let length = this.employeeSource.length
        this.count = res.data.total;
      this.tableSize = page
      this.tableSizes = [page]
      if(length == 0){
        this.employeelength = 0;
      }else{
        this.employeelength = 1;
      }
            console.log(res);
          })
    }else{
      this.http.get('/clientproject/'+id+'?pagevalue='+page).subscribe((res:any) => {
        this.clientSource = res.data.data;
        let length = this.clientSource.length
        this.count = res.data.total;
      this.tableSize = page
      this.tableSizes = [page]
      if(length == 0){
        this.clientlength = 0;
      }else{
        this.clientlength = 1;
      }
            console.log(res);
          })
    }
    //  this.http.get('/project?pagevalue='+page).subscribe((res:any) => {
    //   this.dataSource = res.data.data;
    //   let length = this.dataSource.length
    //   this.count = res.data.total;
    //   this.tableSize = page
    //   this.tableSizes = [page]
    //   if(length == 0){
    //     this.length = 0;
    //   }else{
    //     this.length = 1;
    //   }
    //       console.log(res);
    //     })
  }
  onSubmit(){
    console.log(this.projectForm.value)
    let search = this.projectForm.value.search
    let id = this.id;
    if(this.type=='user'){
      this.http.get('/project?search='+search).subscribe((res:any) => {
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
    }else if(this.type=='employee'){
        this.http.get('/employeeproject/'+id+'?search='+search).subscribe((res:any) => {
          this.employeeSource = res.data.data;
          let length = this.employeeSource.length
          this.count = res.data.total;
          if(length == 0){
            this.employeelength = 0;
          }else{
            this.employeelength = 1;
          }
          console.log(res);
        })
    }else{
      this.http.get('/clientproject/'+id+'?search='+search).subscribe((res:any) => {
        this.clientSource = res.data.data;
        let length = this.clientSource.length
        this.count = res.data.total;
        if(length == 0){
          this.clientlength = 0;
        }else{
          this.clientlength = 1;
        }
        console.log(res);
      })
    }

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

    testfunction(data: any) {
      //alert(data);
      const newdate = new Date(data);
      return moment(newdate).format('DD-MMM-YYYY');
    }

}

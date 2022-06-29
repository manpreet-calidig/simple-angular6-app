import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-listholiday',
  templateUrl: './listholiday.component.html',
  styleUrls: ['./listholiday.component.css']
})
export class ListholidayComponent implements OnInit {
  holidayForm: any = FormGroup;

  dataSource:any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20];
  url = environment.site+'client/'
  permission: any
  length:any;
  constructor(private http:HttpService,
    private formBuilder: FormBuilder,
    private encryptDecryptService: EncryptDecryptService
    ) { }

  ngOnInit(): void {
    this.getHolidayData(this.page);
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if(info.type == 'user'  || info.type == 'employee'){
      let permissions = this.encryptDecryptService.getPermissions()
      this.permission = this.encryptDecryptService.decryptionHandler(permissions)
    }
    this.holidayForm = this.formBuilder.group({
      search: ['']
    });
  }
  onTableDataChange(event: number){
    this.page = event;
    this.getHolidayData(this.page);
  }
  getHolidayData(id:any){
      this.http.get('/holiday?page='+id).subscribe((res:any) => {
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
  onSubmit(){
    console.log(this.holidayForm.value)
    let search = this.holidayForm.value.search
    this.http.get('/holiday?search='+search).subscribe((res:any) => {
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
  pageValue(event:any){
    let page = event.target.value
     this.http.get('/holiday?pagevalue='+page).subscribe((res:any) => {
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
        this.http.get('/holidaydelete/'+id).subscribe((data: any) => {
              this.getHolidayData(this.page);
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

import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2'
import { EncryptDecryptService } from '../services/encrypt-decrypt.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  url = environment.site+'user/'
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20];
  permission: any
  constructor(
    private http: HttpService,
    private encryptDecryptService: EncryptDecryptService
    ) { }
  getlist: any = "";
  length:any;
  ngOnInit(): void {
    this. getresponse(1)
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if(info.type == 'user' || info.type == 'employee'){
      let permissions = this.encryptDecryptService.getPermissions()
      this.permission = this.encryptDecryptService.decryptionHandler(permissions)
    }
  }

  onTableDataChange(event: number){
    this.page = event;
    this.getresponse(this.page);
  }
  getresponse(id: any){
    this.http.get('/user/list?page='+id).subscribe((data: any) => {
      this.getlist = data.data.data
      this.count = data.data.total
      console.log(this.count)
      let length = this.getlist.length
      if(length == 0){
        this.length = 0;
      }else{
        this.length = 1;
      }
    }, err => {
         console.log(err);
    })
  }
  deleteData(id:any){

    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {

        this.http.get('/user/delete/'+id).subscribe((data: any) => {
          this.getresponse(this.page)
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

import { Component, OnInit } from '@angular/core';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2'
import { LeavetypeComponent } from '../leavetype.component';

@Component({
  selector: 'app-listleavetype',
  templateUrl: './listleavetype.component.html',
  styleUrls: ['./listleavetype.component.css']
})
export class ListleavetypeComponent implements OnInit {
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20];
  leaveSource:any;
  id:any;
  type:any;
  permission: any
  length:any;
  constructor(
    private http:HttpService,
    private encryptDecryptService: EncryptDecryptService
    ) { }

  ngOnInit(): void {
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.type = info.type;
    this.id = info.id;
    if(info.type == 'user'  || info.type == 'employee'){
      let permissions = this.encryptDecryptService.getPermissions()
      this.permission = this.encryptDecryptService.decryptionHandler(permissions)
    }
    this.getLeaveTypeData(this.page);
  }
  onTableDataChange(event: number){
    this.page = event;
    this.getLeaveTypeData(this.page);
  }

  getLeaveTypeData(id:any){
    this.http.get('/leave_type?page='+id).subscribe((res:any) => {
      console.log(res.data.leavetype.data)
    this.leaveSource = res.data.leavetype.data;
    this.count = res.data.total;
    let length = this.leaveSource.length
    if(length == 0){
      this.length = 0;
    }else{
      this.length = 1;
    }
  })
}

deleteData(id: string){
  console.log(id);
  Swal.fire({
    title: 'Are you sure want to remove?',
    text: 'You will not be able to recover this file!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.value) {

      this.http.get('/leave_type_delete/'+id).subscribe((data: any) => {
            this.getLeaveTypeData(this.page);
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

import { Component, OnInit } from '@angular/core';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-listprojecttype',
  templateUrl: './listprojecttype.component.html',
  styleUrls: ['./listprojecttype.component.css']
})
export class ListprojecttypeComponent implements OnInit {
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20];
  projectSource:any;
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
    this.getProjectTypeData(this.page);
    if(info.type == 'user'  || info.type == 'employee'){
      let permissions = this.encryptDecryptService.getPermissions()
      this.permission = this.encryptDecryptService.decryptionHandler(permissions)
    }
  }

  onTableDataChange(event: number){
    this.page = event;
    this.getProjectTypeData(this.page);
  }

  getProjectTypeData(id:any){
    this.http.get('/project_type?page='+id).subscribe((res:any) => {
    this.projectSource = res.data.data;
    this.count = res.data.total;
    let length = this.projectSource.length
        if(length == 0){
          this.length = 0;
        }else{
          this.length = 1;
        }
    console.log(this.projectSource);
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

      this.http.get('/project_type_delete/'+id).subscribe((data: any) => {
            this.getProjectTypeData(this.page);
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

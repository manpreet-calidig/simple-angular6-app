import { Component, OnInit } from '@angular/core';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-listreport',
  templateUrl: './listreport.component.html',
  styleUrls: ['./listreport.component.css']
})
export class ListreportComponent implements OnInit {
  dataSource:any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20];
  permission: any
  teamlist:any;
  id:any;
  type:any;
  length:any;
  constructor(
    private http:HttpService,
    private encryptDecryptService: EncryptDecryptService
    ) { }

  ngOnInit() {
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.type = info.type;
    this.id=info.manager_id;
    if(info.type == 'user'  || info.type == 'employee'){
      let permissions = this.encryptDecryptService.getPermissions()
      this.permission = this.encryptDecryptService.decryptionHandler(permissions)
    }
    this.getReportData(this.page)
  }
  getReportData(id: any){
    this.http.get('/report?page='+id).subscribe((res:any) => {
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
  onTableDataChange(event: number){
    this.page = event;
    this.getReportData(this.page)
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
        this.http.get('/reportdelete/'+id).subscribe((data: any) => {

          this.getReportData(this.page)
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

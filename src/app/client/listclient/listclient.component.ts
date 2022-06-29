import { Component, OnInit } from '@angular/core';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-listclient',
  templateUrl: './listclient.component.html',
  styleUrls: ['./listclient.component.css']
})
export class ListclientComponent implements OnInit {
  dataSource:any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20];
  url = environment.site+'client/'
  permission: any

  showModal: boolean = false;
  content: any = '';
  title: any;
  length:any;
  constructor(
    private http:HttpService,
    private encryptDecryptService: EncryptDecryptService
    ) { }

  ngOnInit(): void {
    this.getClientData(this.page);
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if(info.type == 'user'  || info.type == 'employee'){
      let permissions = this.encryptDecryptService.getPermissions()
      this.permission = this.encryptDecryptService.decryptionHandler(permissions)
    }
  }
  onTableDataChange(event: number){
    this.page = event;
    this.getClientData(this.page);
  }
  getClientData(id:any){
      this.http.get('/client?page='+id).subscribe((res:any) => {
      this.dataSource = res.data.data;
      this.count = res.data.total;
      let length = this.dataSource.length
      this.dataSource.forEach( (element:any) => {
        element.project = element.project.replace(/,/g, ", ");
      })
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
        this.http.get('/clientdelete/'+id).subscribe((data: any) => {
              this.getClientData(this.page);
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
      console.log(content)
      this.content = content
      this.showModal = true; // Show-Hide Modal Check

    }
    hide() {
      this.showModal = false;
    }
}

import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  constructor(private http:HttpService) { }
  id:any;
  notiSource:any;
  type:any;
  ngOnInit(): void {
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.id = info.id
    this.type = info.type;
    this.getAllNotification(this.id);
  }

  getAllNotification(id:any){
    this.http.get('/allnotification/'+id).subscribe((res:any) => {
      this.notiSource = res.data;
      console.log(this.notiSource);
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
        this.http.get('/deletenotification/'+id).subscribe((data: any) => {
              
              this.getAllNotification(this.id);
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
          'Your imaginary file is safe',
          'error'
        )
      }
    })
    }
}

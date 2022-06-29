import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2'
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-listoverview',
  templateUrl: './listoverview.component.html',
  styleUrls: ['./listoverview.component.css']
})
export class ListoverviewComponent implements OnInit {
  dataSource:any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20];
  type:any;
  id:any;
  weeks: any;
  connectedTo: any;
  overviewDetail:any;
  total_count = 0;
  encrypted:any;
  decrypted:any;
  contentHide:any;
  length:any;
  constructor(private http:HttpService,
    private route:ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.id=this.route.snapshot.params.id;
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.type = info.type;
    this.getOverviewData(this.page);
    localStorage.removeItem("oldarray")
    localStorage.removeItem("newarray")

    if(this.type != 'client'){
      this.contentHide = "display:none";
    }
  }

  getOverviewData(id: any){
    this.http.get('/overview/'+this.id+'?page='+id).subscribe((res:any) => {

      if(this.type == 'client'){
        this.count = res.data.total;
        this.total_count = res.total;
        this.dataSource = res.data.data;
        let length = this.dataSource.length
        if(length == 0){
          this.length = 0;
        }else{
          this.length = 1;
        }
      }
      if(this.type != 'client'){
        this.dataSource = res.data;
        let length = this.dataSource.length
        if(length == 0){
          this.length = 0;
        }else{
          this.length = 1;
        }
        let dataPush = []
        for (let wee of this.dataSource) {
          dataPush.push(wee.id);
        }
        this.connectedTo = dataPush
      }
  })
}

view(content:any){
  const myArr = this.replacecContent(content).split(" ")
  this.router.navigate(['/project/overview/'+this.id+'/view/'+myArr[0]]);
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

      this.http.get('/overviewdelete/'+id).subscribe((data: any) => {
            this.getOverviewData(this.page);
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

  drop(event: CdkDragDrop<string[]>) {
    let oldarray = event.container.data
    localStorage.setItem("oldarray", JSON.stringify(oldarray));
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    let newarray = event.container.data
    localStorage.setItem("newarray", JSON.stringify(newarray));
    this.callAPI(event.container.id)
  }

  callAPI(id: any) {

    let oldarray = JSON.parse(localStorage.getItem('oldarray') || '{}')
    let newarray = JSON.parse(localStorage.getItem('newarray') || '{}')
    let missing = newarray.filter((item: any) => oldarray.indexOf(item) < 0);
    var parsed = missing[0].toString().replace(/,/g, '.');

    if(parsed != ""){
      const formData =  new  FormData();
      formData.append("id",  id);
      formData.append("content", this.replacecContent(parsed));
      this.http.postcontent('/updatetab',formData).subscribe((res: any) => {
        console.log(res)
      })
    }
    localStorage.removeItem("oldarray")
    localStorage.removeItem("newarray")

  }

  replacecContent(str: any) {
    return str.replace(/<\/?[^>]+(>|$)/g, "")
  }

  onTableDataChange(event: number){
    this.page = event;
    this.getOverviewData(this.page);
  }

  viewInfo(content: string){
    this.router.navigate(['/project/overview/'+this.id+'/view/'+content]);
  }
}

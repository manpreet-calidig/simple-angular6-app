import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import Swal from 'sweetalert2'
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';


@Component({
  selector: 'app-listemployee',
  templateUrl: './listemployee.component.html',
  styleUrls: ['./listemployee.component.css']
})
export class ListemployeeComponent implements OnInit {
  employeeForm: any = FormGroup;
  dataSource:any;
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10];
  url = environment.site+'employee/'
  permission: any
  userteamlist:any
  id:any;
  type:any;
  isSubmitted = false;
  message: any = null;
  showModal: boolean = false;
  content: any = '';
  title: any;
  skills:any;
  length:any;
  pagevalue: any;
  constructor(private http:HttpService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
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
    if(this.pagevalue == undefined) {
      this.pagevalue = 10
    }

    if(this.router.url == '/teamlist'){
      this.type = 'team'
      this.getUserTeamList(this.page)
    }else if(this.router.url == '/employee/listalumni') {
      this.type = 'alumni'
      this.getAlumniList(this.page)
    }else{
      this.getEmployeeData(this.page);
    }
    this.employeeForm = this.formBuilder.group({
      search: ['', Validators.required],
      working_status: ['', Validators.required]
    });
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 3000);

  }

  onTableDataChange(event: number){
    this.page = event;
    if(this.type == 'team'){
      this.getUserTeamList(this.page);
    }else if(this.type == 'alumni') {
      this.getAlumniList(this.page);
    }else{
      this.getEmployeeData(this.page);
    }

  }
  getEmployeeData(id: any){
      this.http.get('/employee?page='+id +'&pagevalue='+ this.pagevalue).subscribe((res:any) => {
      this.dataSource = res.data.data;
      this.dataSource.forEach( (element:any) => {
        console.log(element);
        element.skill = element.skills.replace(/,/g, ", ");
      })
      //this.pageValue(1)
      let length = this.dataSource.length
      this.count = res.data.total;

      //this.tableSize = pageUp
      //this.tableSizes = [pageUp]
      if(length == 0){
        this.length = 0;
      }else{
        this.length = 1;
      }
    })
  }
  get errorControl() {
    return this.employeeForm.controls;
  }
  onSubmit(){
    console.log(this.employeeForm.value)
    let search = this.employeeForm.value.search
    if(this.type == 'team'){
      this.http.get('/team/list?search='+search).subscribe((res: any) => {
        this.userteamlist = res.data.data;
        this.count = res.data.total;
        let length = this.userteamlist.length
      if(length == 0){
        this.length = 0;
      }else{
        this.length = 1;
      }
      })
    }else if(this.type == 'alumni') {
      this.http.get('/employee?search='+search+'&working_status=alumni').subscribe((res:any) => {
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
    }else{
      let working_status = this.employeeForm.value.working_status
      this.http.get('/employee?search='+search+'&working_status='+working_status).subscribe((res:any) => {
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

  }
  pageValue(event:any){
    this.page = 1;
    let pageUp = event.target.value
    this.pagevalue = event.target.value;
    this.tableSize = event.target.value;
    if(this.type == 'team'){
      this.http.get('/team/list?pagevalue='+this.pagevalue).subscribe((res: any) => {
        this.userteamlist = res.data.data;
        this.count = res.data.total;
        let length = this.userteamlist.length
        this.tableSize = pageUp
        this.tableSizes = [pageUp]
        if(length == 0){
          this.length = 0;
        }else{
          this.length = 1;
        }
      })
    }else if(this.type == 'alumni') {
      this.http.get('/employee?pagevalue='+pageUp+'working_status=alumni').subscribe((res:any) => {
        this.dataSource = res.data.data;
        let length = this.dataSource.length
        this.count = res.data.total;
        this.tableSize = pageUp
        this.tableSizes = [pageUp]
        if(length == 0){
          this.length = 0;
        }else{
          this.length = 1;
        }
          console.log(res);
        })
    }else{
      this.http.get('/employee?pagevalue='+pageUp).subscribe((res:any) => {
        this.dataSource = res.data.data;
        let length = this.dataSource.length
        this.count = res.data.total;
        this.tableSize = pageUp
        this.tableSizes = [pageUp]
        if(length == 0){
          this.length = 0;
        }else{
          this.length = 1;
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
        this.http.get('/employeedelete/'+id).subscribe((data: any) => {

              this.getEmployeeData(this.page);
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

    getUserTeamList(id: any){
      this.http.get('/team/list').subscribe((res: any) => {
        this.userteamlist = res.data.data;
        this.count = res.data.total;
        let length = this.userteamlist.length
      if(length == 0){
        this.length = 0;
      }else{
        this.length = 1;
      }
      })
    }

    getAlumniList(id: any){
      this.http.get('/employee?working_status=alumni').subscribe((res:any) => {
        this.dataSource = res.data.data;
        this.count = res.data.total;
        this.dataSource.forEach( (element:any) => {
          console.log(element);
          element.skill = element.skills.replace(/,/g, ", ");
        })
        let length = this.dataSource.length
        if(length == 0){
          this.length = 0;
        }else{
          this.length = 1;
        }
      })
    }

    viewInfo(info: any) {

    }

    show(content: any) {
      console.log(content)
      this.content = content
      this.showModal = true; // Show-Hide Modal Check

    }
    //Bootstrap Modal Close event
    hide() {
      this.showModal = false;
    }
    testfunction(data: any) {
      //alert(data);
      const newdate = new Date(data);
      return moment(newdate).format('DD-MMM-YYYY');
    }
}

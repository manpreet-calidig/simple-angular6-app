import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-calidig-team',
  templateUrl: './calidig-team.component.html',
  styleUrls: ['./calidig-team.component.css']
})
export class CalidigTeamComponent implements OnInit {
  calidigForm: any = FormGroup;
  dataSource:any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20];
  url = environment.site+'employee/'
  id:any;
  type:any;
  isSubmitted = false;
  message: any = null;
  showModal: boolean = false;
  content: any = '';
  title: any;
  skills:any;
  length:any;
  constructor(private http:HttpService, private router: Router,private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getEmployeeData(this.id);
    this.calidigForm = this.formBuilder.group({
      search: ['', Validators.required],
      pagevalue: []
    });
  }
  get errorControl() {
    return this.calidigForm.controls;
  }
    getEmployeeData(id: any){
      this.http.get('/employee?page='+id).subscribe((res:any) => {
      this.dataSource = res.data.data;
      console.log(res.data.data.length)
      this.count = res.data.total;
      this.dataSource.forEach( (element:any) => {
        // console.log(element);
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
  onSubmit(){
    console.log(this.calidigForm.value)
    this.http.post('/calidigteam',this.calidigForm.value).subscribe((res:any) => {
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
    this.calidigForm.value.pagevalue = event.target.value
     this.http.post('/calidigteam',this.calidigForm.value).subscribe((res:any) => {
      this.dataSource = res.data.data;
      let length = this.dataSource.length
      this.count = res.data.total;
      this.tableSize = this.calidigForm.value.pagevalue
      this.tableSizes = [this.calidigForm.value.pagevalue]
      if(length == 0){
        this.length = 0;
      }else{
        this.length = 1;
      }
          console.log(res);
        })
  }
  onTableDataChange(event: number){
    this.page = event;
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
    return moment(newdate).format('DD-MMM');
  }

  removeComma(str: any){
    let content = str.replace(/,\s*$/, "");
    const regEx2 = new RegExp(',,', "g");
    content = content.replace(regEx2, ", ");
    const regEx = new RegExp(',', "g");
    return content.replace(regEx, ", ");
  }
}

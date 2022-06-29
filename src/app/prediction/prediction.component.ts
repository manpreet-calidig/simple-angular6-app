import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit {
  predictionForm: any = FormGroup;

  isSubmitted = false;
  message: any = null;
  dataSource:any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20];
  length:any;
  showModal: boolean = false;
  content: any = '';
  date = moment();
  prediction:any
  constructor(private http:HttpService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getprediction(this.page);
    this.predictionForm = this.formBuilder.group({
      search: ['']
    });
  }

  getprediction(id:any)
  {
    this.http.get('/prediction?page='+id).subscribe((res:any) => {
      this.prediction = res.data;
      this.prediction.forEach( (element:any) => {
        element.project = element.project_name.join(', ');
      })
      let length = this.prediction.length
      if(length == 0){
        this.length = 0;
      }else{
        this.length = 1;
      }
  });
  }
  onSubmit(){
    console.log(this.predictionForm.value)
    let search = this.predictionForm.value.search
    this.http.get('/prediction?search='+search).subscribe((res:any) => {
      this.prediction = res.data;
      this.prediction.forEach( (element:any) => {
        element.project = element.project_name.join(', ');
      })
      let length = this.prediction.length
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
     this.http.get('/prediction?pagevalue='+page).subscribe((res:any) => {
      this.prediction = res.data;
      this.prediction.forEach( (element:any) => {
        element.project = element.project_name.join(', ');
      })
      let length = this.prediction.length
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

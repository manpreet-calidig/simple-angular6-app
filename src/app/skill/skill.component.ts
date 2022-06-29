import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css']
})
export class SkillComponent implements OnInit {
  skillsForm: any = FormGroup;
  skills:any;
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

  constructor(private http:HttpService,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.skillsForm = this.formBuilder.group({
      skills:[''],
    })
    this.getskills();
  }
  getskills(){
    this.http.get('/skills').subscribe((res:any) => {
      this.skills = res.data;
      console.log(this.skills);
  });
}
  onSubmit(){
    this.isSubmitted = true;
    this.message = null;
    this.http.post('/skillsfilter',this.skillsForm.value).subscribe((res:any) => {
      this.dataSource = res.data;
      this.dataSource.forEach( (element:any) => {
        console.log(element);
        element.project = element.project_name.join(', ');
        element.skill = element.skills.replace(/,/g, ", ");
      })
      let length = this.dataSource.length
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

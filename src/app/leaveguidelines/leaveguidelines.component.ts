import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../notification.service';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-leaveguidelines',
  templateUrl: './leaveguidelines.component.html',
  styleUrls: ['./leaveguidelines.component.css']
})
export class LeaveguidelinesComponent implements OnInit {
guidelines:any;
type:any;
role:any;
  constructor(
    private http:HttpService,
    private formBuilder: FormBuilder,
    private notifyService : NotificationService,
    private router: Router,
    private route:ActivatedRoute,
    public datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
      this.type = info.type;
      this.role = info.role;
    this.getGuidelines();
  }
  getGuidelines(){
    this.http.get('/guidelines').subscribe((res:any) => {
      this.guidelines = res.guidelines;
  });
}
}

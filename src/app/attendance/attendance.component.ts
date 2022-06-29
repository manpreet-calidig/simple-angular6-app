import { coerceStringArray } from '@angular/cdk/coercion';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
})
export class AttendanceComponent implements OnInit {
  attendanceForm: any = FormGroup;
  filter: any;
  page = 1;
  id: any;
  dataSource: any;
  // page = 1;
  length: any;
  count = 0;
  tableSize = 20;
  tableSizes = [20];
  months: any;
  status: any;
  date: any;
  employeeDataSource: any;
  monthSource: any;
  todaysAttendance: any;
  totalEmployees: any;
  url = environment.site + 'employee/';
  pagevalue: any;

  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    let id = this.route.snapshot.params.id;
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}');
    let type = info.type;
    let role = info.role;
    if(this.pagevalue == undefined) {
      this.pagevalue = 10
    }
    if (type == 'employee' && role != '1') {
      this.id = info.id;
    } else {
      this.id = id;
    }
    this.getData(this.page, this.filter);
    this.attendanceForm = this.formBuilder.group({
      date: [''],
      status: [''],
      month: [''],
      search: [''],
    });

    this.getemployee();
    this.getStatus();
    this.getMonths();
    this.getTodaysAttendance();
  }
  searchValue(e: any) {
    this.http.get('/attendance?search=' + e).subscribe((res: any) => {
      this.dataSource = res.data.data;
      this.prefixMonth()

      let length = this.dataSource.length;
      this.count = res.data.total;
      if (length == 0) {
        this.length = 0;
      } else {
        this.length = 1;
      }
      console.log(res);
    });
  }

  getData(id: any, filter: any) {
    this.filter = filter;
    if (this.filter == undefined) {
      this.filter = '';
    }

    this.http
      .get('/attendance?page=' + id + '&pagevalue='+ this.pagevalue + '&filter=' + this.filter)
      .subscribe((res: any) => {
        this.dataSource = res.data.data;
        this.prefixMonth()

        let length = this.dataSource.length;
        this.count = res.data.total;
        if (length == 0) {
          this.length = 0;
        } else {
          this.length = 1;
        }
        console.log(res);
      });
  }
  onSubmit() {
    let date = this.datepipe.transform(
      this.attendanceForm.value.date,
      'yyyy-MM-dd'
    );
    let status = this.attendanceForm.value.status;
    let month = this.attendanceForm.value.month;
    let search = this.attendanceForm.value.search;
    this.http
      .get(
        '/attendance?date=' +
          date +
          '&status=' +
          status +
          '&month=' +
          month +
          '&search=' +
          search
      )
      .subscribe((res: any) => {
        this.dataSource = res.data.data;
        this.prefixMonth()

        let length = this.dataSource.length;
        this.count = res.data.total;
        if (length == 0) {
          this.length = 0;
        } else {
          this.length = 1;
        }
        console.log(res);
      });
  }
  pageValue(event: any) {
    let page = event.target.value;
    this.pagevalue = event.target.value;
    this.http.get('/attendance?pagevalue=' + page).subscribe((res: any) => {
      this.dataSource = res.data.data;
      this.prefixMonth()

      let length = this.dataSource.length;
      this.count = res.data.total;
      this.tableSize = page;
      this.tableSizes = [page];
      if (length == 0) {
        this.length = 0;
      } else {
        this.length = 1;
      }
      console.log(res);
    });
  }
  onTableDataChange(event: number) {
    this.page = event;
    this.getData(this.page, this.filter);
  }

  getMonths() {
    this.months = [
      { name: 'January', value: '1' },
      { name: 'Feburary', value: '2' },
      { name: 'March', value: '3' },
      { name: 'April', value: '4' },
      { name: 'May', value: '5' },
      { name: 'June', value: '6' },
      { name: 'July', value: '7' },
      { name: 'August', value: '8' },
      { name: 'September', value: '9' },
      { name: 'October', value: '10' },
      { name: 'November', value: '11' },
      { name: 'December', value: '12' },
    ];
  }

  getStatus() {
    this.status = [
      { name: 'Half Day', value: '2' },
      { name: 'Leave', value: '1' },
      { name: 'Holiday', value: '4' },
      { name: 'Present', value: '5' },
      { name: 'Unpaid Leave', value: '6' },
    ];
  }

  getemployee() {
    this.http.get('/employeelist').subscribe((res: any) => {
      this.employeeDataSource = res.data;
    });
  }

  onChange(event: any) {
    console.log(event.target.value);
    if (this.filter == undefined) {
      this.filter = '';
    }
    let currentmonth = this.datepipe.transform(event.target.value, 'yyyy-MM');
    this.http
      .get(
        '/attendancechart?&filter=' +
          this.filter +
          '&id=' +
          this.id +
          '&month=' +
          currentmonth
      )
      .subscribe((res: any) => {
        this.monthSource = res.data;
        let length = this.monthSource.length;
        this.count = res.data.total;
        if (length == 0) {
          this.length = 0;
        } else {
          this.length = 1;
        }
        console.log(res);
      });
  }

  singleEmployeeAttendance(id: any) {
    this.router.navigate(['/attendance/employee/'+id]);
  }

  getTodaysAttendance() {
    this.http.get('/todaysattendance').subscribe((res:any) => {
      console.log(res);
      this.todaysAttendance = res.data.present;
      this.totalEmployees = res.data.total;
    })
  }
  prefixMonth() {
    let date = this.dataSource[0].date;
    let splitted = date.split("-", 2);
    this.attendanceForm.get('month').setValue(parseInt(splitted[1]))
  }

}


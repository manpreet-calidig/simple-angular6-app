import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import { ChartOptions, ChartType} from 'chart.js';
import { Label } from 'ng2-charts';
@Component({
  selector: 'app-employeeattendance',
  templateUrl: './employeeattendance.component.html',
  styleUrls: ['./employeeattendance.component.css'],
})
export class EmployeeattendanceComponent implements OnInit {
  attendanceForm: any = FormGroup;
  id: any;
  filter: any;
  page = 1;
  dataSource: any;
  monthSource: any;
  // page = 1;
  length: any;
  count : any;
  tableSize = 20;
  tableSizes = [20];
  url = environment.site + 'employee/';
  name: any;
  employee_id: any;
  join_date: any;
  designation: any;
  stream: any;
  image: any;
  type: any;
  role: any;
  showAttendance = true;
  showReport = false;
  totalworkingDays: any;
  totalpresentDays: any;
  totalleaveDays: any;
  dates: any;
  months: any;
  status: any;
  active:boolean = true;
  pagevalue: any;
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: true,
      labels: {
        fontColor: '#bbb'
      }
    },
  };
  public pieChartLabels: Label[] = ['Leaves', 'Working Days', 'Present Days'];
  // public pieChartData: SingleDataSet<pieChartData>;
  pieChartData: any = [
    {
      data: [],
    },
  ];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private formBuilder: FormBuilder
  ) {
    let date = new Date();
    let months = [],
      monthNames = [
        'January',
        'Febuary',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
    for (let i = 0; i < 12; i++) {
      months.push({
        value: monthNames[date.getMonth()] + ' ' + date.getFullYear(),
        id: { month: date.getMonth(), year: date.getFullYear() },
      });
      date.setMonth(date.getMonth() - 1);
    }
    this.dates = months;
  }

  ngOnInit(): void {
    let id = this.route.snapshot.params.id;
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.type = info.type;
    this.role = info.role;
    if(this.pagevalue == undefined) {
      this.pagevalue = 10
    }
    if (this.type == 'employee' && this.role != '1') {
      this.id = info.id;
    } else {
      this.id = id;
    }
    this.getData(this.page);
    this.attendanceForm = this.formBuilder.group({
      date: [''],
      status: [''],
      month: [''],
    });
    this.leavechart();
    this.getStatus();
    this.getMonths();

  }

  onEmployeeChange(event: any) {
    this.id = event.target.value;
  }

  leavechart() {
    if (this.filter == undefined) {
      this.filter = '';
    }
    let currentmonth = '';
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
        // this.count = res.data.total;
        this.totalworkingDays = res.data.day;
        this.totalpresentDays = res.data.present;
        this.totalleaveDays = res.data.leave;
        this.pieChartData = [
          this.totalleaveDays,
          this.totalworkingDays,
          this.totalpresentDays,
        ];
        if (length == 0) {
          this.length = 0;
        } else {
          this.length = 1;
        }
        console.log(res);
      });
  }
  showattend() {
    this.showAttendance = true;
    this.showReport = false;
  }
  showrprt() {
    this.showAttendance = false;
    this.showReport = true;
  }
  getData(id: any) {
    this.http
      .get('/attendance?page=' + id + '&id=' + this.id + '&pagevalue=' + this.pagevalue)
      .subscribe((res: any) => {
        this.dataSource = res.data.data;
        let length = this.dataSource.length;
        this.count = res.data.total;
        this.name =
          res.data.data[0].first_name + ' ' + res.data.data[0].last_name;
        this.employee_id = res.data.data[0].employee_id;
        this.designation = res.data.data[0].designation;
        this.join_date = res.data.data[0].join_date;
        this.stream = res.data.data[0].streams;
        this.image = res.data.data[0].image;

        if (length == 0) {
          this.length = 0;
        } else {
          this.length = 1;
        }
        console.log(res);
      });
  }
  onSubmit() {
    console.log(this.attendanceForm.value);
    let date = this.datepipe.transform(
      this.attendanceForm.value.date,
      'yyyy-MM-dd'
    );
    let status = this.attendanceForm.value.status;
    let month = this.attendanceForm.value.month;
    this.http
      .get(
        '/attendance?date=' +
          date +
          '&id=' +
          this.id +
          '&status=' +
          status +
          '&month=' +
          month +
          '&pagevalue' +
          this.pagevalue
      )
      .subscribe((res: any) => {
        this.dataSource = res.data.data;
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
    this.pagevalue = page;
    this.http
      .get('/attendance?pagevalue=' + page + '&id=' + this.id)
      .subscribe((res: any) => {
        this.dataSource = res.data.data;
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
    this.getData(this.page);
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

  onChange(event:any){
    console.log(event.target.value)
    if(this.filter == undefined) {
      this.filter = '';
    }
    let currentmonth = this.datepipe.transform(event.target.value, 'yyyy-MM');
    this.http.get('/attendancechart?&filter='+this.filter+'&id='+this.id+'&month='+currentmonth + '&pagevalue=' + this.pagevalue).subscribe((res:any) => {
      this.monthSource = res.data;
      let length = this.monthSource.length
      this.count = res.data.total;
      this.totalworkingDays = res.data.day;
      this.totalpresentDays = res.data.present;
      this.totalleaveDays = res.data.leave;
      this.pieChartData = [this.totalleaveDays,this.totalworkingDays,this.totalpresentDays];
      if(length == 0){
        this.length = 0;
      }else{
        this.length = 1;
      }
          console.log(res);

    });
  }
}

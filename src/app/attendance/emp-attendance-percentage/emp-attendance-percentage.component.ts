import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as e from 'express';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/notification.service';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-emp-attendance-percentage',
  templateUrl: './emp-attendance-percentage.component.html',
  styleUrls: ['./emp-attendance-percentage.component.css'],
})
export class EmpAttendancePercentageComponent implements OnInit {
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
  url = environment.site + 'employee/';
  salaryData:any = [];
  enableSubmit = false;
  salaryDate: any = new Date();
  totalEmployees: any;
  total: any;
  year:any;
  array:any=[];
  c:any;
  currentyear:any;

  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public datepipe: DatePipe,
    private spinner: NgxSpinnerService,
    private notifyService : NotificationService
  ) {
    this.salaryDate = this.datepipe.transform(this.salaryDate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    let month = new Date().getMonth()+1;

    let id = this.route.snapshot.params.id;
    let info = JSON.parse(localStorage.getItem('currentUser') || '{}');
    let type = info.type;
    let role = info.role;
    if (type == 'employee' && role != '1') {
      this.id = info.id;
    } else {
      this.id = id;
    }
    this.getData(this.page, this.filter);
    this.attendanceForm = this.formBuilder.group({
      month: [''],
      search: [''],
      year: ['']
    });

    this.attendanceForm.get('month').setValue(month);
    this.getemployee();
    this.getMonths();
    this.years()
  }

  searchValue(e: any) {
    this.http.get('/attendancePercentage?month=' + '').subscribe((res: any) => {
      this.dataSource = res.data.data;
      this.count = res.data.total;
      if (length == 0) {
        this.length = 0;
      } else {
        this.length = 1;
      }
    });
  }

  onChange(event:any)
{
  let value = event.target.value;
  this.year = value.split("-")[0];
  this.attendanceForm.get('year').setValue(this.year)
}

  getData(id: any, filter: any) {
    this.filter = filter;
    if (this.filter == undefined) {
      this.filter = '';
    }

    this.http
      .get('/attendancePercentage?month=')
      .subscribe((res: any) => {
        this.dataSource = res.data;
        this.total = res.total;
        this.getCurrentYear()
        this.totalEmployees = this.dataSource[0].percentageData.total_employees
        if(this.dataSource[0].percentageData.salaryData == null) {
          this.enableSubmit = true;
        } else {
          this.enableSubmit = false;
        }
        this.dataSource.forEach((_e: any) => {
          if(_e.percentageData?.salaryData?.emp_id != null ) {
            let status = _e.percentageData?.salaryData?.status;
            let emp_id = _e.percentageData?.salaryData?.emp_id
            let id = _e.percentageData?.salaryData?.id
            this.salaryData.push({'status': status, 'emp_id': emp_id, 'id': id, 'date': this.salaryDate})
          } else {
            this.salaryData.push({'status': 'open', 'emp_id': _e.id, 'date': this.salaryDate})
          }
        });
        let length = this.dataSource.length;
        this.count = res.data.total;
        if (length == 0) {
          this.length = 0;
        } else {
          this.length = 1;
        }
      });
  }
  onSubmit() {
    let month = this.attendanceForm.value.month;
    let search = this.attendanceForm.value.search;
    let d = new Date();
    let date = d.getDate();
    let year = d.getFullYear();
    let current_month = d.getMonth()+1;
    if( this.year == '' || this.year == undefined || this.year == null) {
      this.year = year;
    } else {
      this.year = parseInt(this.year)
    }
    this.attendanceForm.get('year').setValue(this.year)
  //   if data lies in previous financial year
  if(month <=3 && month >=1 && this.year == year - 1) {
      year = year - 1;
  }
  //   if data lies in current financial year
  else  if (month >= 4 && month <= current_month && this.year == year) {
      year = year;
  }
  //   if data lies in current financial year
  else  if (month >= 4 && month <= current_month && this.year == year - 1) {
      year = year - 1;
  }
  //   if data lies in next months of current financial years
  else if (month > current_month && month <= 12 && this.year == year) {
    year = year;
  }
  else if(month > current_month && month <= 12 && this.year == year - 1) {
    year = year - 1;
  } else {
    year = year;
  }
    if(month != '') {
      if(month < 10) {
        month = '0'+month;
      }
      this.salaryDate = year+'-'+month+'-'+date
      if(date < 10) {
        date = date;
        this.salaryDate = year+'-'+month+'-'+'0'+date
      }
      this.datepipe.transform(this.salaryDate, 'yyyy-MM-dd');
    }
    this.http
      .get(
        '/attendancePercentage?month=' +
          month + '&emp=' + search + '&year=' + year
      )
      .subscribe((res: any) => {
        this.dataSource = res.data;
        this.total = res.total;
        if(this.dataSource[0].percentageData.salaryData == null) {
          this.enableSubmit = true;
        } else {
          this.enableSubmit = false;
        }
        this.salaryData = [];
        this.dataSource.forEach((_e: any) => {
          if(_e.percentageData?.salaryData?.emp_id != null ) {
            let status = _e.percentageData?.salaryData?.status;
            let emp_id = _e.percentageData?.salaryData?.emp_id
            let id = _e.percentageData?.salaryData?.id
            this.salaryData.push({'status': status, 'emp_id': emp_id, 'id': id, 'date': this.salaryDate})
          } else {
            this.salaryData.push({'status': 'open', 'emp_id': _e.id, 'date': this.salaryDate})
          }
        });
        let length = this.dataSource.length;
        this.count = res.data.total;
        if (length == 0) {
          this.length = 0;
        } else {
          this.length = 1;
        }
      });
  }
  onTableDataChange(event: number) {
    this.page = event;
    this.getData(this.page, this.filter);
  }

  getMonths() {
    this.months = [
      { name: 'April', value: '4' },
      { name: 'May', value: '5' },
      { name: 'June', value: '6' },
      { name: 'July', value: '7' },
      { name: 'August', value: '8' },
      { name: 'September', value: '9' },
      { name: 'October', value: '10' },
      { name: 'November', value: '11' },
      { name: 'December', value: '12' },
      { name: 'January', value: '1' },
      { name: 'Feburary', value: '2' },
      { name: 'March', value: '3' },
    ];
  }

  getemployee() {
    this.http.get('/employeelist').subscribe((res: any) => {
      this.employeeDataSource = res.data;
    });
  }

  addSalary() {
    this.spinner.show();
    this.http.post('/addSalary',this.salaryData).subscribe((res:any)=> {
      this.spinner.hide();
      this.notifyService.showSuccess("Salary status has been added !!", "Status Added")
      location.reload()
    }, err=> {
      if(err.status == 500) {
        this.spinner.hide();
        this.notifyService.showSuccess("Salary status has been added !!", "Status Added")
        // location.reload()
      }
    })
  }

  storeSalaryRecords(evt: any, _data: any) {
    let value = evt.target.value
    var data = {
      'status' : value,
      'emp_id' : _data.emp_id,
      'id' : _data.id,
      'date': _data.date
    }

    const itemToRemoveIndex = this.salaryData.findIndex(function(item:any) {
      return item.emp_id == _data.emp_id;
    });

    // proceed to remove an item only if it exists.
    if(itemToRemoveIndex !== -1){
      this.salaryData.splice(itemToRemoveIndex, 1);
    }
    this.salaryData.push(data);
  }

  UpdateSalary(id: any) {
    this.spinner.show();
    this.salaryData.map((d:any)=> {
      if(d.emp_id == id) {
        this.http.post('/updateSalary', d).subscribe((res:any)=> {
          this.spinner.hide();
          this.notifyService.showSuccess("Salary status has been updated !!", "Status Updated")
        })
      }
    })
  }

  pageValue(event: any) {
    let page = event.target.value;
    this.http.get('/attendancePercentage?pagevalue=' + page).subscribe((res: any) => {
      this.dataSource = res.data;
      this.total = res.total;
      if(this.dataSource[0].percentageData.salaryData == null) {
        this.enableSubmit = true;
      } else {
        this.enableSubmit = false;
      }
      let length = this.dataSource.length;
      this.count = res.data.total;
      this.tableSize = page;
      this.tableSizes = [page];
      if (length == 0) {
        this.length = 0;
      } else {
        this.length = 1;
      }
    });
  }

  singleEmployeeAttendance(id: any) {
    this.router.navigate(['/attendance/employee/'+id]);
  }

  years(){
    for (let i = 1; i <= 30; i++) {
      let d = i+1
      let next = 20+d;
      let final= 2020+i;
      this.c = final + '-' + next
      this.array.push(this.c);
    }
  }

  getCurrentYear() {
    for(let year of this.dataSource){
      var date: any;
      let currentyear = new Date().getFullYear();
      if(year.percentageData.salaryData == null) {
          date = currentyear
      } else {
        date = year.percentageData.salaryData.date
        date = date.split("-", 1)
        date = parseInt(date[0])
      }

      let next = date % 100 + 1;
      let final = date  + '-' + next
      this.currentyear = final
    }
  }

}

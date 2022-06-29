import { Component, OnInit, ViewChild, VERSION } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { EncryptDecryptService } from '../services/encrypt-decrypt.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  Events = Array();
  type:any;
  calendarApi:any;
  allcount:any;
  project: any
  client: any
  employee: any
  employeerole: any
  projectlist: any
  prochart: any = [];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth'
  };
  balance: any;
  usedleavebalance: any;
  available: any;
  data:any = [];
  empname:any = [];
  availability:any = [];
  name = 'Angular ' + VERSION.major;
  chart:any;
  holidays:any;
  todayleavecount:any;
  dataSource:any;
  length:any;
  id:any;
  content:any;
  showModal:any;
  page = 1;
  count = 0;
  tableSize = 5;
  tableSizes = [5];
  url = environment.site+'employee/'
  total : any;
  carried : any;
  remaining: any;

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = this.empname;
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: this.data, label: 'Projects' },
    { data: this.availability, label: 'Calidig-Internal' },
    // { data: [40, 30, 28, 25, 22, 20], label: 'Java' },
  ];
  constructor(
    private http: HttpService,
    private router: Router,
    private encryptDecryptService: EncryptDecryptService
    ) {

    //this.router.snapshot.paramMap.get('')
   }
    onDateClick(res:any) {
      Swal.fire('Clicked on date : ' + res.dateStr)
    }

    ngOnInit(){
      let info = JSON.parse(localStorage.getItem('currentUser') || '{}')
      this.type = info.type
      setTimeout(() => {
            this.getEvent("","")
      }, 1000);

      if(localStorage.getItem('permissions') == null ||
      localStorage.getItem('permissions') == "" ||
      localStorage.getItem('permissions') == undefined) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('permissions');
        localStorage.clear();
        location.href = '/'
      }
      this.getCount()
      this.projectchart();
    this.getEmployeeData(this.id);
    }
    getEmployeeData(id: any){
      this.http.get('/employee?page='+id).subscribe((res:any) => {
      this.dataSource = res.data.data;
      this.count = res.data.total;
      this.dataSource.forEach( (element:any) => {
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
  onTableDataChange(event: number){
    this.page = event;
  }
  show(content: any) {
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
    projectchart()
    {
      this.http.get('/projectchart').subscribe((res:any) => {
        this.chart = res.data;
        for(let dd of this.chart){
          if(dd.employee_id != ''){
            this.prochart.push(dd);
          }
        }
        for(let data of this.prochart)
        {
          // this.data = [data.allocc];
          this.data.push(data.allocc)
          this.empname.push(data.name)
          this.availability.push(data.availability)
        }
      })
    }
    getNextMonth(){
      const calendarApi = this.calendarComponent.getApi();
      const month = calendarApi.getDate().getMonth() + 1;
      const getYear = calendarApi.getDate().getFullYear();
      this.getEvent(month,getYear)
    }

    getEvent(month: any,year:any) {
      this.http.get('/holidaycalender?month='+month+'&year='+year).subscribe((res:any) => {
        let  data = Array();
        data = res.data
        this.Events.push(data);
        for(let records of this.Events){
          this.holidays = records
        };
        this.calendarOptions = {
          initialView: 'dayGridMonth',
          dateClick: this.onDateClick.bind(this),
          eventClick:function(arg:any){
            if(arg.event.extendedProps.type == 'holiday') {
              Swal.fire('Holiday','<p class="title-swal">'+arg.event.title+'</p><br><br>'+"<img style='width:100%;height: 260px;' src='"+arg.event.extendedProps.imageURL+"'>");
            }else {
              Swal.fire('Birthday','<p class="title-swal">'+arg.event.title+'</p><br><br>'+"<img style='width:100%;height: 260px;' src='"+arg.event.extendedProps.imageURL+"'>");
            }
          },
          events: this.holidays,
        }
      });
    }

    getCount() {
      this.http.get('/dashboard').subscribe((res:any) => {
        this.employee = res.data.employee
        this.client = res.data.client
        this.project = res.data.project
        this.employeerole = res.data.employeerole
        this.projectlist = res.data.projectlist.data
        this.balance = res.data.balance
        this.remaining = res.data.remaining
        this.total = res.data.total
        this.carried = res.data.carried
        this.usedleavebalance = res.data.usedleavebalance
        this.todayleavecount =  res.data.today;
        this.available = this.balance-this.usedleavebalance;
      });
    }

    nextPage(page: any) {
      if(page == '/leave') {
        this.router.navigate([page],
          { queryParams: { today: 'today' }}
        );
      }else{
        this.router.navigate([page]);
      }

    }
}


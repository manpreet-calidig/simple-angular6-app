import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import {EmployeeComponent} from './employee/employee.component';
import { DatePipe } from '@angular/common';
import { UserComponent } from './user/user.component';
import { AdduserComponent } from './user/adduser/adduser.component';
import { EdituserComponent } from './user/edituser/edituser.component';
import { ListemployeeComponent } from './employee/listemployee/listemployee.component';
import { EditemployeeComponent } from './employee/editemployee/editemployee.component';
import { ToastrModule } from 'ngx-toastr';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgxPaginationModule} from 'ngx-pagination';
import { ClientComponent } from './client/client.component';
import { ListclientComponent } from './client/listclient/listclient.component';
import { EditclientComponent } from './client/editclient/editclient.component';
import { LeaveComponent } from './leave/leave.component';
import { ListleaveComponent } from './leave/listleave/listleave.component';
import { EditleaveComponent } from './leave/editleave/editleave.component';
import { HolidayComponent } from './holiday/holiday.component';
import { EditholidayComponent } from './holiday/editholiday/editholiday.component';
import { ListholidayComponent } from './holiday/listholiday/listholiday.component';
import { ProjectComponent } from './project/project.component';
import { ListprojectComponent } from './project/listproject/listproject.component';
import { EditprojectComponent } from './project/editproject/editproject.component';
import { ApplyleaveComponent } from './applyleave/applyleave.component';
import { ApplyleavelistComponent } from './applyleave/applyleavelist/applyleavelist.component';
import { ApplyleaveeditComponent } from './applyleave/applyleaveedit/applyleaveedit.component';


import { FullCalendarModule } from '@fullcalendar/angular';

// import { FullCalendarModule } from 'ng-fullcalendar';

import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ReportComponent } from './report/report.component';
import { EditreportComponent } from './report/editreport/editreport.component';
import { ListreportComponent } from './report/listreport/listreport.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgSelectModule } from '@ng-select/ng-select';
import { OverviewComponent } from './overview/overview.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { EditoverviewComponent } from './overview/editoverview/editoverview.component';
import { ListoverviewComponent } from './overview/listoverview/listoverview.component';
import { ProjecttypeComponent } from './projecttype/projecttype.component';
import { ListprojecttypeComponent } from './projecttype/listprojecttype/listprojecttype.component';
import { EditprojecttypeComponent } from './projecttype/editprojecttype/editprojecttype.component';
import { LeavetypeComponent } from './leavetype/leavetype.component';
import { ListleavetypeComponent } from './leavetype/listleavetype/listleavetype.component';
import { EditleavetypeComponent } from './leavetype/editleavetype/editleavetype.component';
import { DsrComponent } from './dsr/dsr.component';
import { ListdsrComponent } from './dsr/listdsr/listdsr.component';
import { EditdsrComponent } from './dsr/editdsr/editdsr.component';

import { NgxSummernoteModule } from 'ngx-summernote';
import { ViewComponent } from './view/view.component';
import { NotificationComponent } from './notification/notification.component';
import { LeaveBalanceComponent } from './leave-balance/leave-balance.component';
import { EditleaveBalanceComponent } from './leave-balance/editleave-balance/editleave-balance.component';
import { ListleaveBalanceComponent } from './leave-balance/listleave-balance/listleave-balance.component';
import { PasswordComponent } from './password/password.component';
// Import library module
import { NgxSpinnerModule } from "ngx-spinner";
import { DefectsListComponent } from './defects-list/defects-list.component';
import { SkillComponent } from './skill/skill.component';
import { PredictionComponent } from './prediction/prediction.component';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// import { NgSelect2Module } from 'ng-select2';
import { ChartsModule } from 'ng2-charts';
import { LeaveguidelinesComponent } from './leaveguidelines/leaveguidelines.component';
import { ProfileComponent } from './profile/profile.component';
import { CalidigTeamComponent } from './calidig-team/calidig-team.component';
import { EditleaveguidelinesComponent } from './leaveguidelines/editleaveguidelines/editleaveguidelines.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { EmployeeattendanceComponent } from './attendance/employeeattendance/employeeattendance.component';
import { EmpAttendancePercentageComponent } from './attendance/emp-attendance-percentage/emp-attendance-percentage.component';
import { AuthGuardServicesService } from './services/auth-guard-services.service';

FullCalendarModule.registerPlugins([
  interactionPlugin,
  dayGridPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    EmployeeComponent,
    UserComponent,
    AdduserComponent,
    EdituserComponent,
    ListemployeeComponent,
    EditemployeeComponent,
    ClientComponent,
    ListclientComponent,
    EditclientComponent,
    LeaveComponent,
    ListleaveComponent,
    EditleaveComponent,
    HolidayComponent,
    EditholidayComponent,
    ListholidayComponent,
    ProjectComponent,
    ListprojectComponent,
    EditprojectComponent,
    ApplyleaveComponent,
    ApplyleavelistComponent,
    ApplyleaveeditComponent,
    ReportComponent,
    EditreportComponent,
    ListreportComponent,
    OverviewComponent,
    EditoverviewComponent,
    ListoverviewComponent,
    ProjecttypeComponent,
    ListprojecttypeComponent,
    EditprojecttypeComponent,
    LeavetypeComponent,
    ListleavetypeComponent,
    EditleavetypeComponent,
    DsrComponent,
    ListdsrComponent,
    EditdsrComponent,
    ViewComponent,
    NotificationComponent,
    LeaveBalanceComponent,
    EditleaveBalanceComponent,
    ListleaveBalanceComponent,
    PasswordComponent,
    DefectsListComponent,
    SkillComponent,
    PredictionComponent,
    LeaveguidelinesComponent,
    ProfileComponent,
    CalidigTeamComponent,
    EditleaveguidelinesComponent,
    AttendanceComponent,
    EmployeeattendanceComponent,
    EmpAttendancePercentageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	  FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    FullCalendarModule,
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot(),
    DragDropModule,
    NgSelectModule,
    CKEditorModule,
    NgxSummernoteModule,
    NgxSpinnerModule,
    ChartsModule
    // NgSelect2Module
    // NgxDatatableModule,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe,
    AuthGuardServicesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

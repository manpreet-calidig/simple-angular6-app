import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employee/employee.component';
import {UserComponent } from './user/user.component';
import {AdduserComponent } from './user/adduser/adduser.component';
import {EdituserComponent } from './user/edituser/edituser.component';
import { ListemployeeComponent } from './employee/listemployee/listemployee.component';
import { EditemployeeComponent } from './employee/editemployee/editemployee.component';
import { ClientComponent } from './client/client.component';
import { ListclientComponent } from './client/listclient/listclient.component';
import { EditclientComponent } from './client/editclient/editclient.component';
import { LeaveComponent } from './leave/leave.component';
import { ListleaveComponent } from './leave/listleave/listleave.component';
import { EditleaveComponent } from './leave/editleave/editleave.component';
import { HolidayComponent } from './holiday/holiday.component';
import { ListholidayComponent } from './holiday/listholiday/listholiday.component';
import { EditholidayComponent } from './holiday/editholiday/editholiday.component';
import { ProjectComponent } from './project/project.component';
import { ListprojectComponent } from './project/listproject/listproject.component';
import { EditprojectComponent } from './project/editproject/editproject.component';
import { ApplyleaveComponent } from './applyleave/applyleave.component';
import { ApplyleavelistComponent } from './applyleave/applyleavelist/applyleavelist.component';
import { ApplyleaveeditComponent } from './applyleave/applyleaveedit/applyleaveedit.component';
import { ReportComponent } from './report/report.component';
import { ListreportComponent } from './report/listreport/listreport.component';
import { EditreportComponent } from './report/editreport/editreport.component';
import { OverviewComponent } from './overview/overview.component';
import { ListoverviewComponent } from './overview/listoverview/listoverview.component';
import { EditoverviewComponent } from './overview/editoverview/editoverview.component';
import { ProjecttypeComponent } from './projecttype/projecttype.component';
import { ListprojecttypeComponent } from './projecttype/listprojecttype/listprojecttype.component';
import { EditprojecttypeComponent } from './projecttype/editprojecttype/editprojecttype.component';
import { LeavetypeComponent } from './leavetype/leavetype.component';
import { ListleavetypeComponent } from './leavetype/listleavetype/listleavetype.component';
import { EditleavetypeComponent } from './leavetype/editleavetype/editleavetype.component';
import { DsrComponent } from './dsr/dsr.component';
import { ListdsrComponent } from './dsr/listdsr/listdsr.component';
import { EditdsrComponent } from './dsr/editdsr/editdsr.component';
import { ViewComponent } from './view/view.component';
import { NotificationComponent } from './notification/notification.component';
import { LeaveBalanceComponent } from './leave-balance/leave-balance.component';
import { ListleaveBalanceComponent } from './leave-balance/listleave-balance/listleave-balance.component';
import { EditleaveBalanceComponent } from './leave-balance/editleave-balance/editleave-balance.component';
import { PasswordComponent } from './password/password.component';
import { DefectsListComponent } from './defects-list/defects-list.component';
import { SkillComponent } from './skill/skill.component';
import { PredictionComponent } from './prediction/prediction.component';
import { LeaveguidelinesComponent } from './leaveguidelines/leaveguidelines.component';
import { ProfileComponent } from './profile/profile.component';
import { CalidigTeamComponent } from './calidig-team/calidig-team.component';
import { EditleaveguidelinesComponent } from './leaveguidelines/editleaveguidelines/editleaveguidelines.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { EmployeeattendanceComponent } from './attendance/employeeattendance/employeeattendance.component';
import { EmpAttendancePercentageComponent } from './attendance/emp-attendance-percentage/emp-attendance-percentage.component';
import { AuthGuardGuard } from './guard/auth-guard.guard';

const routes: Routes = [
	{
		path:'',
    redirectTo: '',
    pathMatch: 'full',
    component:LoginComponent
	},
	{
		path:'',
		component:LoginComponent
	},
	{
		path:'dashboard',
		component:DashboardComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'employee',
		component:EmployeeComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'client',
		component:ClientComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'role',
		component:UserComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'role/add',
		component:AdduserComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'role/edit/:id',
		component:EdituserComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'employee/listemployee',
		component:ListemployeeComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'employee/listalumni',
		component:ListemployeeComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'client/listclient',
		component:ListclientComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'employee/edit/:id',
		component:EditemployeeComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'client/edit/:id',
		component:EditclientComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'leave/add',
		component:LeaveComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'leave',
		component:ListleaveComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'leave/edit/:id',
		component:EditleaveComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'holiday/add',
		component:HolidayComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'holiday',
		component:ListholidayComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'holiday/edit/:id',
		component:EditholidayComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'project/add',
		component:ProjectComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'project/type/add',
		component:ProjecttypeComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'project/type',
		component:ListprojecttypeComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'project/type/edit/:id',
		component:EditprojecttypeComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'leave/type/add',
		component:LeavetypeComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'leave/type',
		component:ListleavetypeComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'leave/type/edit/:id',
		component:EditleavetypeComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'dsr/add',
		component:DsrComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'dsr',
		component:ListdsrComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'dsr/edit/:id',
		component:EditdsrComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'project',
		component:ListprojectComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'project/edit/:id',
		component:EditprojectComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'project/overview/:id/add',
		component:OverviewComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'project/overview/:id',
		component:ListoverviewComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'project/overview/:idd/edit/:id',
		component:EditoverviewComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'project/overview/:id/view/:idd',
		component:ViewComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'applyleave/add',
		component:ApplyleaveComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'applyleave',
		component:ApplyleavelistComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'applyleave/edit/:id',
		component:ApplyleaveeditComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'report',
		component:ListreportComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'report/edit/:id',
		component:EditreportComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'report/add',
		component:ReportComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'teamlist',
		component:ListemployeeComponent, canActivate:[AuthGuardGuard]
	 },
	 {
		path:'notification',
		component:NotificationComponent, canActivate:[AuthGuardGuard]
	 },
	 {
		path:'leave_balance/add',
		component:LeaveBalanceComponent, canActivate:[AuthGuardGuard]
	 },
	 {
		path:'leave_balance',
		component:ListleaveBalanceComponent, canActivate:[AuthGuardGuard]
	 },
	 {
		path:'leave_balance/edit/:id',
		component:EditleaveBalanceComponent, canActivate:[AuthGuardGuard]
	 },
	 {
		path:'password',
		component:PasswordComponent, canActivate:[AuthGuardGuard]
	 },
    //  ---- defects
   {
      path:'project/defects_list',
      component: DefectsListComponent, canActivate:[AuthGuardGuard]
   },
   {
		path:'project/defects_list/add',
		component:OverviewComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'project/defects_list/:id',
		component:ListoverviewComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'project/defects_list/:idd/edit/:id',
		component:EditoverviewComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'project/defects_list/:id/view/:idd',
		component:ViewComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'skill',
		component:SkillComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'prediction',
		component:PredictionComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'guidelines',
		component:LeaveguidelinesComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'guidelines/edit/:id',
		component:EditleaveguidelinesComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'profile',
		component:ProfileComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'calidigteam',
		component:CalidigTeamComponent, canActivate:[AuthGuardGuard]
	},
  	{
		path:'attendance',
		component:AttendanceComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'attendance/employee/:id',
		component:EmployeeattendanceComponent, canActivate:[AuthGuardGuard]
	},
	{
		path:'attendance/percentage',
		component:EmpAttendancePercentageComponent, canActivate:[AuthGuardGuard]
	},
	];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StrategicPlanComponent } from './pages/strategic-plan/strategic-plan.component';
import { StrategyComponent } from './pages/strategy/strategy.component';
import { IndicatorComponent } from './pages/indicator/indicator.component';
import { TargetComponent } from './pages/target/target.component';
import { ResultComponent } from './pages/result/result.component';
import { EvidenceComponent } from './pages/evidence/evidence.component';
import { UsersComponent } from './pages/users/users.component';
import { authGuard } from './guards/auth.guard';
import { KpiListComponent } from './pages/kpi-list/kpi-list.component';
import { KpiFormComponent } from './pages/kpi-form/kpi-form.component';
import { TargetFormComponent } from './pages/target-form/target-form.component';
import { ResultFormComponent } from './pages/result-form/result-form.component';
import { EvidenceFormComponent } from './pages/evidence-form/evidence-form.component';
import { roleGuard } from './guards/role.guard';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { StrategicPlanFormComponent } from './pages/strategic-plan-form/strategic-plan-form.component';
import { CategoryComponent } from './pages/category/category.component';
import { CategoryFormComponent } from './pages/category-form/category-form.component';
import { StrategyFormComponent } from './pages/strategy-form/strategy-form.component';
import { KpiDetailComponent } from './pages/kpi-detail/kpi-detail.component';
import { PlanBrowserComponent } from './pages/plan-browser/plan-browser.component';
import { StrategyBrowserComponent } from './pages/strategy-browser/strategy-browser.component';
import { CategoryBrowserComponent } from './pages/category-browser/category-browser.component';
import { MyKpiDetailComponent } from './pages/my-kpi-detail/my-kpi-detail.component';
import { MyKpiComponent } from './pages/my-kpi/my-kpi.component';
import { ReportComponent } from './pages/report/report.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

  { path: 'strategic-plan', component: StrategicPlanComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'strategy', component: StrategyComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'kpi', component: KpiListComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'kpi/new/:categoryId', component: KpiFormComponent },

  { path: 'kpi/edit/:id', component: KpiFormComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'kpi/detail/:id', component: KpiDetailComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'kpi/:id', component: KpiDetailComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'indicator', component: IndicatorComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'target', component: TargetComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'target/edit/:id', component: TargetFormComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'target/:indicatorId/new', component: TargetFormComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'target/:id', component: TargetComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'users', component: UsersComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN'] } },



  { path: 'result/edit/:id', component: ResultFormComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] } },

  { path: 'result/:indicatorId/new', component: ResultFormComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] } },

  { path: 'result/:id', component: ResultComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] } },

  { path: 'evidence/:resultId/new', component: EvidenceFormComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] } },

  { path: 'evidence/:id', component: EvidenceComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },



  { path: 'my-kpi', component: MyKpiComponent, canActivate: [authGuard, roleGuard], data: { roles: ['STAFF'] } },

  { path: 'users/new', component: UserFormComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN'] } },

  { path: 'users/edit/:id', component: UserFormComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN'] } },

  { path: 'strategic-plan/new', component: StrategicPlanFormComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'strategic-plan/edit/:id', component: StrategicPlanFormComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'category', component: CategoryComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'category/new', component: CategoryFormComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'category/edit/:id', component: CategoryFormComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'strategy/new', component: StrategyFormComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'strategy/edit/:id', component: StrategyFormComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'plan-browser', component: PlanBrowserComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'strategy-browser/:id', component: StrategyBrowserComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'category-browser/:id', component: CategoryBrowserComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'kpi/category/:id', component: KpiListComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },

  { path: 'my-kpi-detail/:id', component: MyKpiDetailComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'ADMIN' , 'STAFF'] } },

  { path: 'system-setting', loadComponent: () => import('./pages/system-setting/system-setting.component').then(m => m.SystemSettingComponent) },

  {
    path: 'report',
    component: ReportComponent
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];

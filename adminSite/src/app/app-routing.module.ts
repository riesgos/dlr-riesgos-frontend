import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScenariosComponent } from './components/scenarios/scenarios.component';
import { ServicesComponent } from './components/services/services.component';

const routes: Routes = [{
  path: 'scenarios',
  component: ScenariosComponent
}, {
  path: 'services',
  component: ServicesComponent
}, {
  path: '',
  redirectTo: '/scenarios',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

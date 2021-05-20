import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { RouteMapComponent } from './views/route-map/route-map.component';
import { ScenariosComponent } from './views/scenarios/scenarios.component';
import { RouteDocumentationComponent } from './views/route-documentation/route-documentation.component';
import { LicensesComponent } from './views/licenses/licenses.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/scenarios',
    pathMatch: 'full'
  },
  {
    path: 'map',
    component: RouteMapComponent,
    //canActivate: [AuthGuardService],
  },
  {
    path: 'scenarios',
    component: ScenariosComponent
  },
  {
    path: 'documentation',
    component: RouteDocumentationComponent
  },
  {
    path: 'licenses',
    component: LicensesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class UkisRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { RouteMapComponent } from './route-components/route-map/route-map.component';
import { ScenariosComponent } from './route-components/scenarios/scenarios.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class UkisRoutingModule { }

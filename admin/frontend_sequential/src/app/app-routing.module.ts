import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './pages/map/map.component';
import { ScenarioSelectionComponent } from './pages/scenario-selection/scenario-selection.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'scenarioSelection',
  pathMatch: 'full'
}, {
  path: 'scenarioSelection',
  component: ScenarioSelectionComponent
}, {
  path: 'map',
  component: MapComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MappageComponent } from './views/mappage/mappage.component';
import { StartpageComponent } from './views/startpage/startpage.component';
import { TutorialComponent } from './views/tutorial/tutorial.component';
import { LicensesComponent } from './views/licenses/licenses.component';

const routes: Routes = [{
  path: '',
  component: StartpageComponent
}, {
  path: 'map',
  component: MappageComponent
}, {
  path: 'tutorial',
  component: TutorialComponent
}, {
  path: 'licenses',
  component: LicensesComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MappageComponent } from './views/mappage/mappage.component';
import { StartpageComponent } from './views/startpage/startpage.component';

const routes: Routes = [{
  path: '',
  component: StartpageComponent
}, {
  path: 'map',
  component: MappageComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

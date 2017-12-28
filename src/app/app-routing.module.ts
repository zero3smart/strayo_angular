import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteslayoutComponent } from './components/siteslayout/siteslayout.component';
import { SiteLayoutComponent } from './components/sitelayout/sitelayout.component';
import { DatasetLayoutComponent } from './components/dataset-layout/dataset-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sites',
    pathMatch: 'full'
  },
  {
    path: 'sites',
    component: SiteslayoutComponent
  },
  {
    path: 'sites/:id',
    component: SiteLayoutComponent
  },
  {
    path: 'sites/:site_id/datasets/:dataset_id',
    component: DatasetLayoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

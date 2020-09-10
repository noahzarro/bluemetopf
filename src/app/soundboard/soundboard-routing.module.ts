import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SoundboardPage } from './soundboard.page';

const routes: Routes = [
  {
    path: '',
    component: SoundboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SoundboardPageRoutingModule {}

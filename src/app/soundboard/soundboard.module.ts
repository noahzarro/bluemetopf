import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SoundboardPageRoutingModule } from './soundboard-routing.module';

import { SoundboardPage } from './soundboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SoundboardPageRoutingModule
  ],
  declarations: [SoundboardPage]
})
export class SoundboardPageModule {}

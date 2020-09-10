import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-soundboard',
  templateUrl: './soundboard.page.html',
  styleUrls: ['./soundboard.page.scss'],
})
export class SoundboardPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  checkVersion(){
    let version = 0;
    // check if contents.json already exists

    // get version of database

    // if own version is older, reload database
  }

}

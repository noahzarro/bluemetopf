import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { File } from '@ionic-native/file/ngx';
import {
  FileTransfer,
  FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Component({
  selector: 'app-soundboard',
  templateUrl: './soundboard.page.html',
  styleUrls: ['./soundboard.page.scss'],
})
export class SoundboardPage implements OnInit {
  constructor(
    private file: File,
    private httpClient: HttpClient,
    private transfer: FileTransfer,
    private audio: NativeAudio
  ) {}

  items = [];

  ngOnInit() {
    this.updateDatabase();
  }

  updateDatabase() {
    let version = 0;
    let databaseVersion = 0;
    // check if content.json already exists
    this.file
      .readAsText(this.file.dataDirectory, 'content.json')
      .then(
        (contentsFile) => {
          console.log('found content.json');
          version = JSON.parse(contentsFile)['version'];
        },
        (error) => {
          console.log('did not find content.json' + error);
        }
      )
      .finally(() => {
        // get version of database
        this.httpClient
          .get('https://www.eth-lerngruppe.ch/bluementopf/content.json')
          .toPromise()
          .then((newContentsFile) => {
            console.log(newContentsFile['version']);
            databaseVersion = newContentsFile['version'];
          })
          .catch((error) => {
            console.log('no connection');
            databaseVersion = 0;
          })
          .finally(() => {
            // if own version is older, reload database
            if (version <= databaseVersion) {
              // update local database
              this.httpClient
                .get('https://www.eth-lerngruppe.ch/bluementopf/content.json')
                .toPromise()
                .then((newContentsFile) => {
                  // update local items list
                  this.items = newContentsFile['items'];

                  // save content.json
                  this.file
                    .writeFile(
                      this.file.dataDirectory,
                      'content.json',
                      JSON.stringify(newContentsFile),
                      { replace: true }
                    )
                    .then((_) => console.log('Directory exists'))
                    .catch((err) => console.log("Directory doesn't exist"));

                  // download and save sounds and images
                  const fileTransfer: FileTransferObject = this.transfer.create();

                  this.items.forEach((soundItem) => {
                    const folderName = soundItem['name'] + '/';
                    const mp3Online =
                      'https://www.eth-lerngruppe.ch/bluementopf/' +
                      folderName +
                      soundItem['name'] +
                      '.mp3';

                    const mp3Local =
                      this.file.dataDirectory +
                      folderName +
                      soundItem['name'] +
                      '.mp3';

                    const imgLocal =
                      this.file.dataDirectory + folderName + soundItem['image'];

                    const imgOnline =
                      'https://www.eth-lerngruppe.ch/bluementopf/' +
                      folderName +
                      soundItem['image'];

                    console.log(mp3Online);
                    console.log(imgOnline);
                    console.log(mp3Local);
                    console.log(imgLocal);

                    soundItem['imageURL'] = imgLocal;

                    // download mp3
                    fileTransfer.download(mp3Online, mp3Local).then(
                      (obj) => {
                        console.log('saved audio: ' + JSON.stringify(obj));
                      },
                      (err) => {
                        console.log(err);
                      }
                    );
                    soundItem['soundPath'] = folderName + soundItem['name'] + '.mp3';

                    // download image
                    fileTransfer.download(imgOnline, imgLocal);
                  });
                });
            }
          });
      });
  }

  playSound(path: string) {
    console.log(path);
    this.audio.preloadSimple("gitter", "../"+path).then(() => {
      this.audio.play("gitter");
    }).catch((err) => {console.log(err)});
  }
}

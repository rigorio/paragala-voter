import {Component} from '@angular/core';
import {TSMap} from "typescript-map";
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {AlertController} from "ionic-angular";
import {Response} from "../Response";
import {Host} from "../host";

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  email: string;
  id: any;
  map = new TSMap();
  school: string;
  schools: string[];
  host: string;

  constructor(private alertCtrl: AlertController,
              private http: HttpClient) {
    this.host = Host.host;

    let url = this.host + "/api/data/schools";
    this.http.get<Response>(url).pipe().toPromise().then(response => {
      this.schools = response.message;
    });


  }

  register() {
    this.map.set("school", this.school);
    this.map.set("uniqueId", this.id);
    this.map.set("email", this.email);
    this.getConfig().pipe().toPromise().then(response => {
      let alert = this.alertCtrl.create({
        title: response['status'],
        subTitle: response['message'],
        buttons: ['Ok']
      });
      // add loading
      alert.present();
    }).catch(error=> {
      let alert = this.alertCtrl.create({
        title: error['status'],
        subTitle: error['message'],
        buttons: ['Ok']
      });
      // add loading
      alert.present();
    });
  }


  private getConfig() {
    let message = this.map.toJSON();
    console.log(message);
    let url = this.host + "/api/account/registration";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Response>(url, message, httpOptions);
  }

}

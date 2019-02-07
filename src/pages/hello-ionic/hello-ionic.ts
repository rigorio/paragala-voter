import {Component} from '@angular/core';
import {TSMap} from "typescript-map";
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {AlertController, LoadingController} from "ionic-angular";
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

  constructor(
    private alertCtrl: AlertController,
    private http: HttpClient,
    private loadingController: LoadingController
  ) {
    this.host = Host.host;

    let url = this.host + "/api/data/schools";
    this.http.get<Response>(url).pipe().toPromise().then(response => {
      this.schools = response.message;
    });


  }

  register() {
    let loading = this.loadingController.create({content: "Registering..."});

    if (this.school == null || this.id == null || this.email == null)  {
      let alert = this.alertCtrl.create({
        title: "Please fill up all required details",
        buttons: ['Ok']
      });
      // add loading
      alert.present();
      return;
    }

    this.map.set("school", this.school);
    this.map.set("uniqueId", this.id);
    this.map.set("email", this.email);
    loading.present();
    this.getConfig().pipe().toPromise().then(response => {
      let alert = this.alertCtrl.create({
        title: response['status'],
        subTitle: response['message'],
        buttons: ['Ok']
      });
      // add loading
      loading.dismissAll();
      alert.present();
      this.map.delete("school");
      this.map.delete("uniqueID");
      this.map.delete("email")
    })
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

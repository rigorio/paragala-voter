import {Component} from '@angular/core';
import {TSMap} from "typescript-map";
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {AlertController} from "ionic-angular";
import {Response} from "../checkout/Response";

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

  constructor(private alertCtrl: AlertController,
              private http: HttpClient) {
    this.fillSchools();
  }

  register() {
    this.map.set("school", this.school);
    this.map.set("uniqueId", this.id);
    this.map.set("email", this.email);

    this.getConfig().subscribe((response: Response) => {
      let alert = this.alertCtrl.create({
        title: response['status'],
        subTitle: response['message'],
        buttons: ['Ok']
      });
      // add loading
      alert.present();
    });


  }

  private getSchools() {


  }

  private getConfig() {
    let message = this.map.toJSON();
    console.log(message);
    let url = "http://localhost:8080/api/registration";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<Response>(url, message, httpOptions);
  }

  private fillSchools() {
    this.schools = [
      'Holy Angel University',
      'Angeles University Foundation',
      'Mabalacat City College',
      'Tarlac State University'
    ]
  }
}

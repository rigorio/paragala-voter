import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {VoteItem} from "./vote-item";
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {TSMap} from "typescript-map"
import {Response} from "./Response"
import {tryCatch} from "rxjs/util/tryCatch";
import {catchError} from "rxjs/operators";

/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  categories: string[];
  schools: string[];
  votes: VoteItem[];
  id: any;
  code: any;
  school: any;
  mapRequest = new TSMap();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private alertCtrl: AlertController,
    private http: HttpClient
  ) {
    this.fillSchools();

    this.categories = [];
    this.categories = navParams.get("categories");
    this.votes = [];
    for (let category of this.categories) {
      this.storage.get(category).then(value => {
        this.votes.push({
          title: value.title,
          category: value.category,
          company: value.company,
        })
      })
        .catch(ayawko => {
        });
    }


    // this.storage = navParams.get("storage");
  }

  confirmVotes() {
    if (this.id == null || this.code == null) {
      let alert = this.alertCtrl.create({
        title: 'Incomplete Details!',
        subTitle: 'Please fill out all the details before confirming your vote',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    this.mapRequest.set("id", this.id);
    this.mapRequest.set("code", this.code);
    this.mapRequest.set("school", this.school);
    this.mapRequest.set("votes", this.votes);
    // var jsonReq = JSON.stringify(this.mapRequest);
    this.getConfig().subscribe((response: Response)=>{
      let alert = this.alertCtrl.create({
        title: response['status'],
        subTitle: response['message'],
        buttons: ['Ok']
      });
      alert.present();
    })

    // console.log(jsonReq);
    // console.log(jsonReq);

    // this.http.post()


  }

  private getConfig() {
    let message = this.mapRequest.toJSON();
    console.log(message);
    let url = "https://murmuring-earth-96219.herokuapp.com/api/vote";
    // fetch(url, {
    //   body
    // })
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<Response>(url, message, httpOptions);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      let alert = this.alertCtrl.create({
        title: 'An error occurred:',
        subTitle: error.error.message +
          `Please try again later`,
        buttons: ['Ok']
      });
      alert.present();
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      let alert = this.alertCtrl.create({
        title: 'An error occurred:',
        subTitle:
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}` +
          `Please retry or contact an administrator for help.`,
        buttons: ['Ok']
      });
      alert.present();
    }
  };

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
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
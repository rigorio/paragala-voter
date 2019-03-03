import {Component} from '@angular/core';
import {AlertController, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {VoteItem} from "./vote-item";
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {TSMap} from "typescript-map"
import {Response} from "../Response"
import {Host} from "../host";
import {HelloIonicPage} from "../hello-ionic/hello-ionic";
import {NomineePage} from "../list/list";
import {ItemDetailsPage} from "../item-details/item-details";

/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }

  categories: string[];
  votes: VoteItem[];
  voteIds: number[] = [];
  code: string;
  mapRequest = new TSMap();
  host: string;
  pages: Array<{ title: string, component: any }>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private alertCtrl: AlertController,
    private http: HttpClient,
    private loadingController: LoadingController
  ) {


    // this.storage = navParams.get("storage");
  }

  ionViewDidEnter() {
    let loading = this.loadingController.create({content: "Loading..."});
    loading.present();

    this.pages = [
      {title: 'Home', component: HelloIonicPage},
      {title: 'Cast Votes', component: NomineePage},
      {title: 'Submit Votes', component: CheckoutPage}
    ];


    this.host = Host.host;


    this.categories = [];
    let url = this.host + "/api/data/categories";
    this.http.get<Response>(url).pipe().toPromise().then(response => {
      console.log(response);
      this.categories = response.message;
    }).then(_ => {
      this.votes = [];
      for (let category of this.categories) {
        console.log(category);
        this.storage.get(category).then(value => {
          console.log("ara");
          console.log(value.title + " " + value.category + " " + value.company);
          this.voteIds.push(value.id);
          this.votes.push({

            title: value.title,
            category: value.category,
            company: value.company,
          })
        }).catch(_ => {
        });
      }
      console.log("sparkles");
      console.log(this.voteIds);
      loading.dismissAll();
    });
    console.log("nanie?");
    this.categories.forEach(categ => console.log(categ));

  }

  selectCategory(event, category) {

    let selected: any;
    let url = Host.host + "/api/data/nominees?category=" + category;
    console.log("nanda?");
    this.http.get<Response>(url).pipe().toPromise().then(response => {
      console.log(response);
      selected = response.message;
      this.navCtrl.push(ItemDetailsPage, {
        selectedNominees: selected,
        category: category
      })
    });


  }


  sendVotes() {
    if (this.kwan())
      return;

    let loading = this.loadingController.create({content: "Sending votes..."});
    let map = new TSMap();
    map.set('votes', this.voteIds);
    map.set('voterCode', this.code);
    let message = map.toJSON();
    let url = this.host + "/api/voters/v2/vote";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    loading.present();
    this.http.post<Response>(url, message, httpOptions).pipe()
      .toPromise().then(response => {
      console.log(response);
      let alert = this.alertCtrl.create({
        title: response.status,
        subTitle: response.message,
        buttons: ['Ok']
      });
      alert.present();

      if (response.status != "Not allowed"){
        console.log('Confirm Okay');
        this.storage.clear();
        this.navCtrl.setRoot(NomineePage);
      }
    }).then(_ => {
        loading.dismissAll();
      }
    );

  }

  openPage(page) {
    // navigate to the new page if it is not the current page
    this.navCtrl.setRoot(page.component);
  }

  private getConfig() {
    let message = this.mapRequest.toJSON();
    console.log(message);
    let url = this.host + "/api/voters/vote";
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

  reset() {
    let alert = this.alertCtrl.create({
      title: 'Are you sure you want to start over?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            this.storage.clear();
            this.navCtrl.setRoot(NomineePage);
          }
        }
      ]
    });

    alert.present();
  }


  async presentAlertConfirm() {

  }

  private kwan() {
    if (this.code == null || this.code.length < 1) {
      let alert = this.alertCtrl.create({
        title: 'Please enter your voter code',
        buttons: ['Ok']
      });
      alert.present();
      return true;
    }
    return false;
  }
}

import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';

import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Response} from "../Response";
import {ItemDetailsPage} from '../item-details/item-details';
import {CheckoutPage} from "../checkout/checkout";
import {HttpClient} from "@angular/common/http";
import {Host} from "../host";
import {HelloIonicPage} from "../hello-ionic/hello-ionic";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class NomineePage {
  titles: string[];
  companies: string[];
  categories: string[];
  newCategories: Array<{ name: string, status: boolean }> = [];
  nominees: Array<{ id: number, title: string, company: string, category: string }>;
  selected: Array<{ id: number, title: string, company: string, category: string }>;
  host: string;
  variable: true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private loadingController: LoadingController,
              private alertCtrl: AlertController,
              private http: HttpClient) {



  }

  ionViewDidEnter() {
    let loading = this.loadingController.create({content: "Loading..."});
    loading.present();
    console.log("shang ri la");

    this.host = Host.host;
    this.nominees = [];
    this.newCategories = [];

    let url = this.host + "/api/data/nominees";
    this.http.get<Response>(url).pipe().toPromise()
      .then(response => {
        console.log(response.status);
        this.nominees = response.message;
      });

    let categUrl = this.host + "/api/data/categories";
    this.http.get<Response>(categUrl).pipe().toPromise()
      .then(response => {
        console.log(response.status);
        this.categories = response.message;
      }).then(_ => {
      this.categories.forEach(category => {
        this.storage.get(category).then(value => {
          console.log("seeing this" + value);
          var stat: boolean = true;
          if (value === null)
            stat = false;
          this.newCategories.push({
            name: category,
            status: stat
          });
        });
      })
      loading.dismissAll();
    });
  }

  selectCategory(event, category) {
    this.selected = this.nominees.filter(nominee => nominee.category == category);
    this.navCtrl.push(ItemDetailsPage, {
      selectedNominees: this.selected,
      category: category
    })
  }

  reset() {
    this.storage.clear();
    this.navCtrl.setRoot(NomineePage);
  }

  sendVotes() {
    this.navCtrl.push(CheckoutPage);
  }
}

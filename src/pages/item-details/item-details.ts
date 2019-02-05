import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';

import {NavController, NavParams} from 'ionic-angular';
import {MapList} from "../list/map-list";
import {Host} from "../host";
import {NomineePage} from "../list/list";


@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  nominees:  Array<{ id: number, title: string, company: string, category: string }>;
  category: any;
  voted: boolean = false;
  items: Array<{ title: string, company: string, category: string, box: boolean }>;
  host: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    this.host = Host.host;
    // If we navigated to this page, we will have an item available as a nav param
    this.nominees = navParams.get('selectedNominees');
    this.category = navParams.get('category');


    this.items = [];
    this.voted = true;
    this.addItems();


  }

  select($event, nominee) {
    this.storage.set(this.category, new MapList(nominee.title, nominee.company, nominee.category));
    this.storage.get(this.category).then(value => console.log(value));
    this.navCtrl.setRoot(NomineePage);
  }

  // TODO NANUYNI ?!?!
  private addItems() {
    let box = false;
    var tempTitle: string = "";
    this.storage.get(this.category).then(value => {

      for (let i = 0; i < this.nominees.length; i++) {
        if (this.nominees[i].title == value.title)
          box = true;
        this.items.push({
          title: this.nominees[i].title,
          company: this.nominees[i].company,
          category: this.nominees[i].category,
          box: box
        });
        box = false;
      }
    console.log("temporary title is " + tempTitle);
    }).catch(
      value=>{
        for (let i = 0; i < this.nominees.length; i++) {

          this.items.push({
            title: this.nominees[i].title,
            company: this.nominees[i].company,
            category: this.nominees[i].category,
            box: false
          });
        }
      }

    );
    console.log(this.items);
  }
}

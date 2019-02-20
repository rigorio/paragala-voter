import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';

import {NavController, NavParams} from 'ionic-angular';
import {MapList} from "../list/map-list";
import {Host} from "../host";
import {NomineePage} from "../list/list";
import {Nominee} from "../Nominee";


@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  nominees:  Nominee[];
  category: any;
  voted: boolean = false;
  items: Array<{ id: number, title: string, company: string, category: string, box: boolean }>;
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

  select($event, item) {
    this.storage.set(this.category, new Nominee(item.id, item.title, item.company, item.category));
    this.storage.get(this.category).then(value => console.log(value));
    this.navCtrl.setRoot(NomineePage);
  }

  // TODO NANUYNI ?!? I think the purpose is that it adds a box thing
  private addItems() {
    let box = false;
    var tempTitle: string = "";
    this.storage.get(this.category).then(value => {

      for (let i = 0; i < this.nominees.length; i++) {
        if (this.nominees[i].title == value.title)
          box = true;
        this.items.push({
          id: this.nominees[i].id,
          title: this.nominees[i].title,
          company: this.nominees[i].company,
          category: this.nominees[i].category,
          box: box
        });
        box = false;
      }
    console.log("temporary title is " + tempTitle);
    }).catch( // idk what this is
      value=>{
        for (let i = 0; i < this.nominees.length; i++) {

          this.items.push({
            id: this.nominees[i].id,
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

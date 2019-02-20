import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AlertController, LoadingController, NavController} from "ionic-angular";
import {NomineePage} from "../list/list";
import {CheckoutPage} from "../checkout/checkout";

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {


  constructor(
    private alertCtrl: AlertController,
    private http: HttpClient,
    private loadingController: LoadingController,
    public navCtrl: NavController
  ) {

  }

  castVotes(page) {
    // navigate to the new page if it is not the current page
    this.navCtrl.setRoot(NomineePage);
  }

}

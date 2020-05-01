import { Component } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Presentation} from '../../model/presentation';

@Component({
  selector: 'app-admin',
  template: `

  <div class="center"  *ngIf="items?.length">
    <img class="player-image"
    [src]="items[counter]"
    >

    <div>
      <button class="button" (click) ="goToPrevImage()">PREV</button>
      <span class="counter">{{counter + 1}}/ {{items.length}}</span>
      <button class="button" (click) = "goToNextImage()">NEXT </button>
    </div>
  </div>
  


  <div class="gallery">

    <div class="center">
      <form #f="ngForm" (submit)="addImage(f.value.tmb)">
        <input type="text" placeholder="Add new image URL" [ngModel] name="tmb">
        <button class="button" type="button" (click)="generateRandomImage()" >Generate Image</button>
      </form>
    </div>
  
    <div class="image-container">
      <div class="grid">
        <div class="cell" *ngFor="let item of items">
        <img class="responsive-image" [src]="item">
        <span class="icon cursor" (click)="deleteImage(item)">✖</span>
        </div>

      </div>
    </div>
  </div>

      `,
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  items: string[]=[];
  counter: number;

  constructor(private db: AngularFireDatabase) { 
    db.object<Presentation>('presentation')
    .valueChanges()
      .subscribe((res: Presentation) => {
        this.items = (res && res.images) || [];
        this.counter = (res && res.counter) || 0;
      });
  }

  addImage(url: string){
    console.log(url);
    this.items = [...this.items, url]
    this.db.object('presentation/images').set(this.items);
  }

  deleteImage(itemToDelete : string){
    this.items = this.items.filter(item => item !== itemToDelete)
    this.db.object('presentation/images').set(this.items);
    if ( this.counter > this.items.length -1){
      this.updateCounter(0);
    }

  }

  goToPrevImage(){
    const tot = this.items.length-1;
    const counter = (this.counter > 0) ? this.counter-1 : 0;
    this.updateCounter(counter);
  }

  goToNextImage(){
    const tot = this.items.length-1;
    const counter = (this.counter < tot) ? this.counter+1 : 0;
    this.updateCounter(counter);
  }

  updateCounter(counter : number){
    this.db.object('presentation/counter').set(counter); 
  }

  generateRandomImage() {
    const random = Math.floor(Math.random() * 200);
    const tmb = `https://picsum.photos/600/400?image=${random}`;
    this.addImage(tmb);
  }

}

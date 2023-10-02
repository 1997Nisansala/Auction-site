import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Item } from 'src/app/shared/services/user';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  itemId: string = '';
  itemName: string = '';
  itemDescription: string = '';
  startingPrice: number = 0;
  imageUrl: string = '';
  rating: string = '';
  highestbid : number = 0;
  highestbidder : string = '';
  counter : number = 0;
  date : string = '';
  itemsCollection: AngularFirestoreCollection<Item>;
  items$: Observable<Item[]>;

  constructor(private readonly firestore: AngularFirestore) {
    this.itemsCollection = firestore.collection<Item>('items', ref => ref.where('counter', '==', 0));
    this.items$ = this.itemsCollection.valueChanges();
  }
}

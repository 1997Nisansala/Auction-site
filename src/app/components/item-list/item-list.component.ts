import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/services/user';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  data: any;
  userRating: any;
  itemId: string = '';
  itemName: string = '';
  itemDescription: string = '';
  startingPrice: number = 0;
  highestbid: number = 0;
  imageUrl: string = '';
  rating: string = '';
  bid: number = 0;
  itemsCollection: AngularFirestoreCollection<Item>;
  items$: Observable<Item[]>;

  constructor(private readonly firestore: AngularFirestore) {
    this.itemsCollection = firestore.collection<Item>('items');
    this.items$ = this.itemsCollection.valueChanges();
  }

  ngOnInit() {
  }
       
}

export interface Item {
  imageUrl: string;
  itemName: string;
  itemDescription: string;
  startingPrice: number;
  rating: string;
  itemId: string;
  highestbid: number;
  bid: number;
  counter : number;
}

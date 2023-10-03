import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Bids, Item } from 'src/app/shared/services/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.css']
})
export class UserStatisticsComponent implements OnInit {
  @Input() item: any;
  bidsCollection: AngularFirestoreCollection<Bids>;
  bids$: Observable<Bids[]> | undefined;
  data: any;
  itemsCollection: AngularFirestoreCollection<Item>;
  items$: Observable<Item[]> | undefined;

  constructor(private readonly firestore: AngularFirestore) {
    this.bidsCollection = this.firestore.collection<Bids>('bids');
    this.itemsCollection = this.firestore.collection<Item>('items');
  }

  ngOnInit() {
    const dataString = localStorage.getItem('key');

    if (dataString !== null) {
      this.data = JSON.parse(dataString);
      
      // Now that you have retrieved the data, you can use it to set up your Firestore collection.
      this.bidsCollection = this.firestore.collection<Bids>('bids', ref => ref.where('highestbidder', '==', this.data));
      this.bids$ = this.bidsCollection.valueChanges();

      this.itemsCollection = this.firestore.collection<Item>('items', ref => ref.where('highestbidder', '==', this.data));
      this.items$ = this.itemsCollection.valueChanges();
    }
  }
}

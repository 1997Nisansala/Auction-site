import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Item } from 'src/app/shared/services/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  itemsCollection: AngularFirestoreCollection<Item>;
  items$: Observable<Item[]>;

  constructor(private readonly firestore: AngularFirestore) {
    this.itemsCollection = firestore.collection<Item>('items', ref => ref.where('counter', '==', 0));
    this.items$ = this.itemsCollection.valueChanges();
  }

  ngOnInit() {
    // You can remove this line as you are already initializing items$ in the constructor
    // this.items$ = this.getItems();
  }

  // Custom sorting function for Rank of Item based on 'A', 'B', 'C' ratings
  sortByRankOfItem() {
    this.items$ = this.items$.pipe(
      map(items => {
        // Define a custom order for ratings with an index signature
        const ratingOrder: { [key: string]: number } = { 'A': 1, 'B': 2, 'C': 3 };

        // Sort items based on the custom order
        return items.sort((a, b) => ratingOrder[a.rating] - ratingOrder[b.rating]);
      })
    );
  }

  // Custom sorting function for Rank of Winner based on 'A', 'B', 'C' ratings
  sortByRankOfWinner() {
    this.items$ = this.items$.pipe(
      map(items => {
        // Define a custom order for ratings with an index signature
        const ratingOrder: { [key: string]: number } = { 'A': 1, 'B': 2, 'C': 3 };

        // Sort items based on the custom order of winner ratings
        return items.sort((a, b) => ratingOrder[a.rankofhighestbidder] - ratingOrder[b.rankofhighestbidder]);
      })
    );
  }
}

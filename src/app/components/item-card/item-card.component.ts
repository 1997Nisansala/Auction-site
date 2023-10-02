import { Component, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/app/shared/services/user';
import { CountdownEvent } from "ngx-countdown";

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent {
  @Input() item: any;
  data: any;
  userRating: any;
  counter : any;

  today = new Date();

  isSubmitButtonDisabled: boolean = false; 

  constructor(private readonly firestore: AngularFirestore) {
    
  }
  handleEvent(event: CountdownEvent): void {
    if (event.action === 'done' && this.item.counter > 0) {
      // The countdown has reached 0, update the counter in the database
      this.updateCounterInDatabase(0); // Set the counter to 0
      this.isSubmitButtonDisabled = true;
    }
  }

  private updateCounterInDatabase(newValue: number): void {
    const itemId = this.item.itemId;

    this.firestore.collection('items', ref => ref.where('itemId', '==', itemId))
      .get()
      .subscribe(querySnapshot => {
        if (querySnapshot.size === 0) {
          console.log('No item found with the provided ID.');
        } else {
          querySnapshot.forEach(doc => {
            const itemDocRef = doc.ref;

            itemDocRef.update({
              counter: newValue,
            }).then(() => {
              console.log('Counter updated to 0 in the database.');
            }).catch(error => {
              console.error('Error updating counter in the database:', error);
            });
          });
        }
      }, error => {
        console.error('Error searching for item:', error);
      });
  }

  ngOnInit() {
    const dataString = localStorage.getItem('key');

    if (dataString !== null) {
      this.data = JSON.parse(dataString);
    }

    // Check if the initial counter value is 0 and disable the button accordingly
    if (this.item.counter === 0) {
      this.isSubmitButtonDisabled = true;
    }

    this.firestore.collection('users', ref => ref.where('email', '==', this.data))
      .get()
      .subscribe(querySnapshot => {
        if (querySnapshot.size === 0) {
          console.log('No user found with the provided email.');
        } else {
          querySnapshot.forEach(doc => {
            const userData = doc.data() as User;
            console.log('User found:', userData);
            this.userRating = userData.rating;
          });
        }
      }, error => {
        console.error('Error searching for user:', error);
      });
  }

  

  updateItem(item: Item) {
    if (!item.itemId) {
      console.error('Item ID field is empty. Please enter an item ID.');
      return;
    }
    
    if (this.userRating === 'A' || (this.userRating === 'B' && (item.rating === 'B' || item.rating === 'C')) || (this.userRating === 'C' && item.rating === 'C')) {
      const itemId = item.itemId;
      const itemName = item.itemName;

      if (item.highestbid == null) {
        item.highestbid = 0;
      }

      if (item.bid > item.highestbid && item.bid > item.startingPrice) {
        item.highestbid = item.bid;

        this.firestore.collection('items', ref => ref.where('itemId', '==', itemId))
          .get()
          .subscribe(querySnapshot => {
            if (querySnapshot.size === 0) {
              console.log('No item found with the provided ID.');
            } else {
              querySnapshot.forEach(doc => {
                const itemDocRef = doc.ref;

                itemDocRef.update({
                  highestbid: item.highestbid,
                  highestbidder: this.data,
                  date : this.today,
                  counter : 180,
                }).then(() => {
                  console.log('Bid updated successfully.');
                }).catch(error => {
                  console.error('Error updating Bid', error);
                });
              });
            }
          }, error => {
            console.error('Error searching for item:', error);
          });

      } else {
        console.log('The new offer is not higher than the current highest bid.');
        alert('The new offer is not higher than the current highest bid.');
      }
    } else {
      console.log('User does not have permission to submit an offer on this item.');
      alert('User does not have permission to submit an offer on this item.');
    }
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
  date : Date;
}

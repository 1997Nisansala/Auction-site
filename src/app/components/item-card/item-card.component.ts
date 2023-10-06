import { Component, Input, SimpleChanges } from '@angular/core';
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

  gap : number = 0;

  today = new Date();

  

  isSubmitButtonDisabled: boolean = false; 

  constructor(private readonly firestore: AngularFirestore) {
    //alert( this.item.time);
    //this.gap = Date.now() - this.item.time;
  }
  ngOnChanges(changes: SimpleChanges) { 
      // Recalculate 'gap' whenever 'item' changes
      const  t1 = (Date.now() - this.item.time)/1000;
      if(this.item.counter > t1){
        this.gap = this.item.counter - t1;
      }
      else{
        this.gap = 0;
      }
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
  
      // Update the "bids" collection
      this.firestore.collection('bids').add({
        itemId: itemId,
        itemName : item.itemName,
        highestbid: item.highestbid,
        highestbidder: this.data,
        date: this.today,
        rating : item.rating,
        startingPrice : item.startingPrice,
        rankofhighestbidder: this.userRating,
        counter: 180,
      }).then(() => {
        console.log('Bid added to "bids" collection successfully.');
      }).catch(error => {
        console.error('Error adding bid to "bids" collection', error);
        window.alert('Error adding bid to "bids" collection: ' + error);
      });
  
      if (item.bid > item.highestbid && item.bid > item.startingPrice) {
        item.highestbid = item.bid;
  
        // Update the "items" collection
        this.firestore.collection('items', ref => ref.where('itemId', '==', itemId))
          .get()
          .subscribe(querySnapshot => {
            if (querySnapshot.size === 0) {
              console.log('No item found with the provided ID.');
            } else {
              querySnapshot.forEach(doc => {
                const itemDocRef = doc.ref;
  
                itemDocRef.update({
                  itemName : item.itemName,
                  highestbid: item.highestbid,
                  highestbidder: this.data,
                  date: this.today,
                  rankofhighestbidder: this.userRating,
                  rating : item.rating,
                  startingPrice : item.startingPrice,
                  counter : (Number(item.counter) + 180).toString(),
                }).then(() => {
                  console.log('Bid updated successfully in "items" collection.');
                  window.alert('Your Bid updated successfully');
                }).catch(error => {
                  console.error('Error updating Bid in "items" collection', error);
                  window.alert('Error updating Bid in "items" collection: ' + error);
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
  time : number;
}

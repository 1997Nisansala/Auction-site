The project is a website in Angular and Firebase
The site will resemble an auction site, the admin can add items for sale, each item will be in its own card with a timer and rating of the product A B C
Three more types of users A B C when they show the rating of the user
User A will be able to submit an offer on everything, user B will be able to submit only on B and C and user C will be able to submit only on C
Each item added to the site by the admin will be initialized with an option to upload photos, a description and a starting price when a user submits an offer, the price will also be updated on each item, there will be a timer if an offer is submitted when the timer is less than 3 minutes, the timer will be updated to 3 minutes


When a new user wants to register
He will enter his details and will be asked to type his name, password and ID. The initial rating that will be given is C and admin will be able to change the rating for users.

In addition to these 3 pages
1. login
2. items auction site
3. add items for admin
3. items bid by user
4. statistics for admin
On the tax page 4, the administrator will see statistics of the tax of the items sold and the total amount that went into the site cash register



item 
    bidcount
    highest bid



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
  userRating : any;
  itemId: string = '';
  itemName: string = '';
  itemDescription: string = '';
  startingPrice: number = 0;
  highestbid : number = 0;
  imageUrl: string = '';
  rating: string = '';
  bid : number = 0;
  itemsCollection: AngularFirestoreCollection<Item>;
  items$: Observable<Item[]>;

  constructor(private readonly firestore: AngularFirestore) {
    // Reference the 'items' collection
    this.itemsCollection = firestore.collection<Item>('items');
    // Get an Observable of item data
    this.items$ = this.itemsCollection.valueChanges();
  }

  ngOnInit() {
    // Retrieve data from localStorage
    const dataString = localStorage.getItem('key');
  
    if (dataString !== null) {
      // Parse the JSON if it's not null
      this.data = JSON.parse(dataString);
    }

    // Search for the user by email
    this.firestore.collection('users', ref => ref.where('email', '==', this.data))
      .get()
      .subscribe(querySnapshot => {
        if (querySnapshot.size === 0) {
          console.log('No user found with the provided email.');
          // You can handle this case as needed (e.g., display a message to the user)
        } else {
          // Assuming there's only one user with the same email (unique email)
          querySnapshot.forEach(doc => {
            const userData = doc.data() as User;
            console.log('User found:', userData);
            this.userRating = userData.rating;
            // Do something with the user data (e.g., display it in your UI)
          });
        }
      }, error => {
        console.error('Error searching for user:', error);
        // Handle the error as needed (e.g., display an error message)
      });
  }


  updateItem(item: Item) {
    if (!item.itemId) {
      console.error('Item ID field is empty. Please enter an item ID.');
      return;
    }
  
    // Check if the user has the permission to submit an offer on this item based on their rating
    if (this.userRating === 'A' || (this.userRating === 'B' && (item.rating === 'B' || item.rating === 'C')) || (this.userRating === 'C' && item.rating === 'C')) {
      // User can submit an offer
  
      // Now you can access item properties directly
      const itemId = item.itemId;
      const itemName = item.itemName;
  
      if (item.highestbid == null) {
        item.highestbid = 0;
      }
  
      // Check if the current offer is higher than the highest bid
      if (item.bid > item.highestbid && item.bid > item.startingPrice) {
  
        // Update the highest bid with the new offer
        item.highestbid = item.bid;
  
        this.firestore.collection('items', ref => ref.where('itemId', '==', itemId))
          .get()
          .subscribe(querySnapshot => {
            if (querySnapshot.size === 0) {
              console.log('No item found with the provided ID.');
            } else {
              querySnapshot.forEach(doc => {
                const itemDocRef = doc.ref;
  
                // Update the user's data
                itemDocRef.update({
                  highestbid: item.highestbid,
                  highestbidder: this.data,
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
  itemId : string;
  highestbid : number;
  bid: number;
}

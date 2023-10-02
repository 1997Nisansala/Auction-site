import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs/operators';
import { Item } from 'src/app/shared/services/user';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {
  itemId: string = '';
  itemName: string = '';
  itemDescription: string = '';
  startingPrice: number = 0;
  imageUrl: string = '';
  rating: string = '';
  highestbid : number = 0;
  highestbidder : string = '';
  counter : number = 180;

  constructor(private fireStorage: AngularFireStorage, private firestore: AngularFirestore) {}

  async onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const path = `items/${file.name}`;
      const uploadTask = this.fireStorage.upload(path, file);

      // Track the percentage of the upload
      uploadTask.percentageChanges().subscribe(percentage => {
        // You can display the upload progress here if needed
        console.log(`Uploading: ${percentage}%`);
      });

      // Get the download URL when the upload is complete
      await uploadTask.snapshotChanges().pipe(
        finalize(() => {
          this.fireStorage.ref(path).getDownloadURL().subscribe(url => {
            this.imageUrl = url; // Store the image URL
            console.log(`Download URL: ${url}`);
          });
        })
      ).subscribe();
    }
  }

  searchItem() {
    if (!this.itemId) {
      window.alert('Item Id field is empty. Please enter an id.');
      return;
    }

    this.firestore.collection('items', ref => ref.where('itemId', '==', this.itemId))
      .get()
      .subscribe(querySnapshot => {
        if (querySnapshot.size === 0) {
          window.alert('No item found with the provided ID.');
        } else {
          querySnapshot.forEach(doc => {
            const itemData = doc.data() as Item;
            console.log('User found:', itemData);
            this.itemId = itemData.itemId;
            this.itemName = itemData.itemName;
            this.itemDescription = itemData.itemDescription;
            this.startingPrice = itemData.startingPrice;
            this.imageUrl = '';
            this.rating = itemData.rating;
          });
        }
      }, error => {
        console.error('Error searching for user:', error);
        // Handle the error as needed (e.g., display an error message)
      });
  }

  updateItem() {
    if (!this.itemId) {
      window.alert('Email field is empty. Please enter an email.');
      return;
    }
    this.firestore.collection('items', ref => ref.where('itemId', '==', this.itemId))
      .get()
      .subscribe(querySnapshot => {
        if (querySnapshot.size === 0) {
          window.alert('No item found with the provided ID.');

        } else {
          querySnapshot.forEach(doc => {
            const itemDocRef = doc.ref;

            // Update the user's data
            itemDocRef.update({
              itemId : this.itemId,
              itemName : this.itemName,
              itemDescription : this.itemDescription,
              startingPrice : this.startingPrice,
              imageUrl : this.imageUrl,
              rating: this.rating,
            }).then(() => {
              window.alert('User updated successfully.');
            }).catch(error => {
              window.alert('Error updating user:'+ error);
            });
          });
        }
      }, error => {
        console.error('Error searching for user:', error);
      });
  }
  
  deleteItem() {
    if (!this.itemId) {
      window.alert('Item Id field is empty. Please enter an id.');
      return;
    }
  
    // Display a confirmation dialog to the user
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    
    // Check if the user confirmed the deletion
    if (confirmed) {
      // Check if the item with the provided itemId exists in the Firestore collection
      this.firestore.collection('items', ref => ref.where('itemId', '==', this.itemId))
        .get()
        .subscribe(querySnapshot => {
          if (querySnapshot.size === 0) {
            window.alert('No item found with the provided ID.');
          } else {
            querySnapshot.forEach(doc => {
              const itemDocRef = doc.ref;
  
              // Delete the item from Firestore
              itemDocRef.delete()
                .then(() => {
                  window.alert('Item deleted successfully.');
                  // Optionally, clear the form fields or reset any necessary data
                  this.itemId = '';
                  this.itemName = '';
                  this.itemDescription = '';
                  this.startingPrice = 0;
                  this.imageUrl = '';
                  this.rating = '';
                })
                .catch(error => {
                  console.error('Error deleting item:', error);
                  // Handle the error as needed (e.g., display an error message)
                });
            });
          }
        }, error => {
          console.error('Error searching for item:', error);
          // Handle the error as needed (e.g., display an error message)
        });
    } else {
      // The user canceled the deletion, do nothing
      console.log('Deletion canceled by the user.');
    }
  }
  

  addItem() {
    const itemData = {
      itemId: this.itemId,
      itemName: this.itemName,
      itemDescription: this.itemDescription,
      startingPrice: this.startingPrice,
      imageUrl: this.imageUrl,
      rating: this.rating, 
      highestbid : this.highestbid,
      highestbidder : this.highestbidder,
      counter : this.counter,
    };

    this.firestore.collection('items', ref => ref.where('itemId', '==', this.itemId))
      .get()
      .subscribe(querySnapshot => {
        if (querySnapshot.size === 0) {
            // Add the item to Firestore collection (e.g., 'items')
            this.firestore.collection('items').add(itemData)
            .then((docRef) => {
              window.alert('Item added successfully with ID: '+ docRef.id)
              // Clear the form fields or reset any necessary data, including rating
              this.itemId = '';
              this.itemName = '';
              this.itemDescription = '';
              this.startingPrice = 0;
              this.imageUrl = '';
              this.rating = ''; // Reset the rating field
            })
            .catch((error) => {
              console.error('Error adding item: ', error);
            });
        } else {
          window.alert('Entered ItemID is exist');
        }
      }, error => {
        console.error('Error searching for user:', error);
        // Handle the error as needed (e.g., display an error message)
      });
    
  }
}


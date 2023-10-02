import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/services/user';

@Component({
  selector: 'app-admin-user-rating',
  templateUrl: './admin-user-rating.component.html',
  styleUrls: ['./admin-user-rating.component.css']
})
export class AdminUserRatingComponent {
  rating: string = '';
  email: string = '';
  displayName : string = '';

  constructor(private firestore: AngularFirestore) {}

  addUser() {
    // Create an object with user details
    const userData: User = {
      email: this.email,
      photoURL: '',
      emailVerified: false,
      rating: this.rating,
      uid: '',
      displayName: this.displayName
    };

    // Add the user to Firestore collection (e.g., 'users')
    this.firestore.collection('users').add(userData)
      .then((docRef) => {
        console.log('User added successfully with ID: ', docRef.id);
        window.alert('User added successfully with ID: '+ docRef.id);
        // Clear the form fields
        this.rating = '';
        this.email = '';
        this.displayName = '';
      })
      .catch((error) => {
        console.error('Error adding user: ', error);
      });
  }

  searchUser() {
    // Check if the email field is empty
    if (!this.email) {
      console.error('Email field is empty. Please enter an email.');
      window.alert('Email field is empty. Please enter an email.');
      return;
    }

    // Search for the user by email
    this.firestore.collection('users', ref => ref.where('email', '==', this.email))
      .get()
      .subscribe(querySnapshot => {
        if (querySnapshot.size === 0) {
          console.log('No user found with the provided email.');
          window.alert('No user found with the provided email.');
          // You can handle this case as needed (e.g., display a message to the user)
        } else {
          // Assuming there's only one user with the same email (unique email)
          querySnapshot.forEach(doc => {
            const userData = doc.data() as User;
            console.log('User found:', userData);
            this.displayName = userData.displayName;
            this.rating = userData.rating;
            // Do something with the user data (e.g., display it in your UI)
          });
        }
      }, error => {
        console.error('Error searching for user:', error);
        // Handle the error as needed (e.g., display an error message)
      });
  }

  deleteUser() {
    // Check if the email field is empty
    if (!this.email) {
      window.alert('Email field is empty. Please enter an email.');
      return;
    }
  
    // Show a confirmation dialog to the user
    const confirmed = window.confirm('Are you sure you want to delete this user?');
  
    // Check if the user confirmed the deletion
    if (confirmed) {
      // Check if the user with the provided email exists in the Firestore collection
      this.firestore.collection('users', ref => ref.where('email', '==', this.email))
        .get()
        .subscribe(querySnapshot => {
          if (querySnapshot.size === 0) {
            window.alert('No user found with the provided email.');
          } else {
            querySnapshot.forEach(doc => {
              const userDocRef = doc.ref;
  
              // Delete the user from Firestore
              userDocRef.delete()
                .then(() => {
                  window.alert('User deleted successfully.');
                  // Optionally, clear the form fields or reset any necessary data
                  this.email = '';
                  this.displayName = '';
                  this.rating = '';
                })
                .catch(error => {
                  console.error('Error deleting user:', error);
                });
            });
          }
        }, error => {
          console.error('Error searching for user:', error);
        });
    } else {
      // The user canceled the deletion, do nothing
      console.log('Deletion canceled by the user.');
    }
  }
  
  
  updateUser() {
    // Check if the email field is empty
    if (!this.email) {
      console.error('Email field is empty. Please enter an email.');
      window.alert('Email field is empty. Please enter an email.');
      return;
    }

    // Update the user's information by email
    this.firestore.collection('users', ref => ref.where('email', '==', this.email))
      .get()
      .subscribe(querySnapshot => {
        if (querySnapshot.size === 0) {
          window.alert('No user found with the provided email.');
          // You can handle this case as needed (e.g., display a message to the user)
        } else {
          // Assuming there's only one user with the same email (unique email)
          querySnapshot.forEach(doc => {
            const userDocRef = doc.ref;
            // Update the user's data
            userDocRef.update({
              displayName: this.displayName,
              rating: this.rating,
            }).then(() => {
              window.alert('User updated successfully.');
              // Optionally, you can update the displayed user information
            }).catch(error => {
              console.error('Error updating user:', error);
              // Handle the error as needed (e.g., display an error message)
            });
          });
        }
      }, error => {
        console.error('Error searching for user:', error);
        // Handle the error as needed (e.g., display an error message)
      });
  }
}

import {Injectable, NgZone} from '@angular/core';
import {User} from './user';
import * as auth from 'firebase/auth';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore, AngularFirestoreDocument,} from '@angular/fire/compat/firestore';
import {Router} from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private db: AngularFireDatabase
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        //this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            localStorage.setItem('key', JSON.stringify(user.email));
            this.router.navigate(['item-details']);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign in with email/password
SignInAdmin(email: string, password: string) {
  const adminEmail = "admin@gmail.com";
  const adminPassword = "1234567";

  if (adminEmail === email && adminPassword === password) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        //this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['add-item']);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  } else {
    window.alert("Invalid email or password");
    return Promise.reject("Invalid email or password"); // Add this return statement
  }
}



  // Sign up with email/password
  SignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificationMail() function when new user sign
        up and returns promise */
        // this.SendVerificationMail();
        window.alert("User registered Succesfully");
        this.router.navigate(['']);
        this.SetUserData2(result.user, password);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Send email verification when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Returns true when user is logged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      this.router.navigate(['facilitymanager-dashboard']);
    });
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.router.navigate(['facilitymanager-dashboard']);
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      rating: 'C',
      password : user.password
    };
  
    // Save data to Firestore
    const userFirestoreRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    userFirestoreRef.set(userData, { merge: true });
  
    // Save data to Realtime Database
    const userRealtimeRef = this.db.object(`users/${user.uid}`);
    userRealtimeRef.set(userData)
      .then(() => {
        console.log('Data successfully written to the Realtime Database.');
      })
      .catch(error => {
        console.error('Error writing data to the Realtime Database:', error);
      });
  
    return Promise.resolve(true);
  }

  SetUserData2(user: any, password: string) {
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      rating: 'C',
      password : password
    };
  
    // Save data to Firestore
    const userFirestoreRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    userFirestoreRef.set(userData, { merge: true });
  
    // Save data to Realtime Database
    const userRealtimeRef = this.db.object(`users/${user.uid}`);
    userRealtimeRef.set(userData)
      .then(() => {
        console.log('Data successfully written to the Realtime Database.');
      })
      .catch(error => {
        console.error('Error writing data to the Realtime Database:', error);
      });
  
    return Promise.resolve(true);
  }
  
  

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }
}

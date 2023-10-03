export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  rating : string;
}

export interface Item {
  itemId: string;
  itemName: string;
  itemDescription: string;
  startingPrice: number;
  imageUrl: string;
  rating: string;
  highestbid : number;
  highestbidder : string;
  rankofhighestbidder : string;
  counter : number;
  date : Date;
}


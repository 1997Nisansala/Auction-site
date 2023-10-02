import { Component } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Auction-Site';
  activePath: string = '';
  activeClassName: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activePath = event.url.split('/')[1] || 'default';
        this.activeClassName = this.activePath + 'PageClass';
        console.log(this.activeClassName);
      }
    });
  }
}

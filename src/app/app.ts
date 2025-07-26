import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { MainContent } from './layout/main-content/main-content';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { CreateAccountModal } from './create-account-modal/create-account-modal';
import { PopupMessagesComponent } from './popup-messages/popup-messages.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    Header,
    Footer,
    MainContent,
    MatSidenavModule,
    MatListModule,
    PopupMessagesComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'TDHCA';

  constructor(private dialog: MatDialog) {}

  openCreateAccountDialog() {
    this.dialog.open(CreateAccountModal, {
      width: '400px',
      data: {},
    });
  }

  logNavigation(page: string) {
    console.log(`App sidenav navigation - Navigating to: ${page}`);
    console.log(`Current URL: ${window.location.href}`);

    // Log the current route
    setTimeout(() => {
      console.log(`URL after navigation attempt: ${window.location.href}`);
    }, 100);
  }
}

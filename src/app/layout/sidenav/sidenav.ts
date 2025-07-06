import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { CreateAccountModal } from '../../create-account-modal/create-account-modal';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatSidenavModule, MatListModule, MatIconModule, RouterModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class SidenavComponent {
  @ViewChild('drawer') drawer!: MatSidenav;

  constructor(private dialog: MatDialog) {}

  openCreateAccountDialog() {
    this.dialog.open(CreateAccountModal, {
      width: '400px',
      data: {},
    });
  }

  close() {
    this.drawer.close();
  }

  logNavigation(page: string) {
    console.log(`Navigating to: ${page}`);
    console.log(`Current URL: ${window.location.href}`);
  }
}

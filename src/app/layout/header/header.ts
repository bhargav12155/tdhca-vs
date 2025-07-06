import { Component, Output, EventEmitter } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { CreateAccountModal } from '../../create-account-modal/create-account-modal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Output() menuClick = new EventEmitter<void>();
  isMobileMenuOpen = false;

  constructor(private dialog: MatDialog) {}

  openCreateAccountDialog() {
    this.dialog.open(CreateAccountModal, {
      width: '400px',
      data: {},
    });
  }

  onMenuClick() {
    this.menuClick.emit();
  }

  logNavigation(page: string) {
    console.log(`Header navigation - Navigating to: ${page}`);
    console.log(`Current URL: ${window.location.href}`);
  }
}

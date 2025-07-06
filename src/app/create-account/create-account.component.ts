import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  standalone: true,
  imports: [MatCardModule],
})
export class CreateAccountComponent {}

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  standalone: true,
  imports: [MatCardModule],
})
export class HelpComponent {}

import { Component } from '@angular/core';

@Component({
  selector: 'app-database-unavailable',
  standalone: true,
  imports: [],
  templateUrl: './database-unavailable.component.html',
  styleUrl: './database-unavailable.component.scss'
})
export class DatabaseUnavailableComponent {
  reload() {
    window.location.reload();
  }
}

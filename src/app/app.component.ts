import { Component, inject } from '@angular/core';
import { LoadingService } from './core/services/loading/loading.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatProgressBarModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  loadingService = inject(LoadingService);
}

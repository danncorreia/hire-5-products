import { Component, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-custom-properties',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './custom-properties.component.html',
  styleUrls: ['./custom-properties.component.scss']
})
export class CustomPropertiesComponent {
  @Input() isEditing = false;
  @Input({ required: true }) properties = signal<{ key: string; value: string }[]>([]);

  addCustomProperty(): void {
    this.properties.update(props => [...props, { key: '', value: '' }]);
  }

  removeCustomProperty(index: number): void {
    this.properties.update(props => props.filter((_, i) => i !== index));
  }
}

import { Component } from '@angular/core';
import { TicketIaService } from '../../services/ticket-ia.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-valida-ticket',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './valida-ticket.component.html',
  styles: ``
})
export class ValidaTicketComponent {

     result: string = '';
  imagePreview: string | null = null;
  title = 'face-ia';

  constructor(private ticketAI: TicketIaService) {}

    async onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;

        const img = new Image();
        img.src = this.imagePreview;

        img.onload = async () => {
          const { label, confidence } = await this.ticketAI.predict(img);
          this.result = `Resultado: ${label} (${(confidence * 100).toFixed(1)}%)`;
        };
      };
      reader.readAsDataURL(file);
    }
  }


}

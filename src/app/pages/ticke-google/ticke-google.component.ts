import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-ticke-google',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticke-google.component.html',
  styles: ``
})
export class TickeGoogleComponent {

  ticketImageBase64: string = '';
  ticketImagePreview: string = '';
  result: any = null;
  loading = false;

  constructor(private http: HttpClient) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.ticketImageBase64 = (reader.result as string).split(',')[1]; // solo base64
      this.ticketImagePreview = result;
    };
    reader.readAsDataURL(file);
  }

  enviarImagen() {
    if (!this.ticketImageBase64) return;

    const body = {
      content: this.ticketImageBase64,
      mimeType: 'image/jpeg', // cambia según el tipo de imagen
    };

    this.loading = true;
    this.http
      .post('https://myma-promos.com/promos/ticketsIA/googleai/procesar-ticket.php', body, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.result = res.entities || res; // por si no está anidado
        },
        error: err => {
          this.loading = false;
          console.error('Error al procesar el ticket:', err);
        },
      });
  }

  getField(type: string, minConfidence = 0.7): string {
    const match = this.result?.find((e: any) =>
      e.type === type && (!minConfidence || e.confidence >= minConfidence)
    );
    return match?.value || 'No detectado';
  }

}

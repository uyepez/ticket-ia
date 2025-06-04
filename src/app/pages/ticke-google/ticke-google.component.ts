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
  result: any = null;
  loading = false;

  private endpoint =
    'https://us-documentai.googleapis.com/v1/projects/775823749947/locations/us/processors/22535e684263dce8:process';
  private apiKey = 'AIzaSyB_3g3VUEUd0a06WfellnK6FDS-oDOKUu4'; // reemplaza por tu clave API

  constructor(private http: HttpClient) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.ticketImageBase64 = (reader.result as string).split(',')[1];
    };
    reader.readAsDataURL(file);
  }

  enviarImagen() {
    if (!this.ticketImageBase64) return;

    const body = {
      rawDocument: {
        content: this.ticketImageBase64,
        mimeType: 'image/jpeg', // o 'image/png' según el tipo
      },
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.loading = true;
    this.http
      .post(`${this.endpoint}?key=${this.apiKey}`, body, { headers })
      .subscribe({
        next: (response: any) => {
          this.result = response.document?.entities || [];
          this.loading = false;
        },
        error: err => {
          console.error('Error:', err);
          this.loading = false;
        },
      });
  }

  getField(type: string): string {
    const match = this.result?.find((e: any) => e.type === type);
    return match?.mentionText || 'No detectado';
  }

}

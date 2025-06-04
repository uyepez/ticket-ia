import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import Tesseract from 'tesseract.js';

@Component({
  selector: 'app-texto-ticket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './texto-ticket.component.html',
  styles: ``
})
export class TextoTicketComponent {

  extractedText = '';
  total = '';
  date = '';
  folio = '';
   previewUrl: string | null = null;

  async handleFile(event: any) {
    const file = event.target.files[0];
    this.previewUrl = await this.readFileAsDataURL(file); // Guarda imagen para mostrarla

    Tesseract.recognize(
      this.previewUrl,
      'spa+eng', // OCR en español e inglés
      { logger: m => console.log(m) }
    ).then(({ data }) => {
      this.extractedText = data.text;
      this.extractData(this.extractedText);
    });
  }

  extractData(text: string) {
    const totalMatch = text.match(/(?:Total|TOTAL|TOTAL M.N.|Importe|IMPORTE)[^\d]*(\d+[.,]?\d{2})/);
    this.total = totalMatch ? totalMatch[1] : 'No detectado';

    const dateMatch = text.match(/\b(\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})\b/);
    this.date = dateMatch ? dateMatch[1] : 'No detectada';

    const folioMatch = text.match(/(?:Folio|FOLIO|No\.?)[^\d]*(\d{4,})/);
    this.folio = folioMatch ? folioMatch[1] : 'No detectado';
  }

  readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

}

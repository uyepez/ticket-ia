import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TicketIaService } from './services/ticket-ia.service';
import { CommonModule } from '@angular/common';
import { ValidaTicketComponent } from './pages/valida-ticket/valida-ticket.component';
import { TextoTicketComponent } from './pages/texto-ticket/texto-ticket.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ValidaTicketComponent, TextoTicketComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {



}

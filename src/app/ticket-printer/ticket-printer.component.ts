import { Component, Input, OnInit } from '@angular/core';

// Define una interfaz para la estructura de tus datos del evento
export interface EventTicketData {
  evento: string;
  fecha: string;
  hora: string;
  lugar: string;
  asiento: string;
  codigo: string;
}

@Component({
  selector: 'app-ticket-printer',
  templateUrl: './ticket-printer.component.html',
  styleUrls: ['./ticket-printer.component.scss'],
  standalone: true
})
export class TicketPrinterComponent implements OnInit {

  // @Input() permite que los datos del ticket sean pasados desde el componente padre
  @Input() eventData: EventTicketData = {
    evento: 'Concierto de Rock',
    fecha: '15 de Julio de 2025',
    hora: '20:00',
    lugar: 'Auditorio Principal',
    asiento: 'Fila 12, Asiento 05',
    codigo: '#ABCDE12345'
  };

  constructor() { }

  ngOnInit(): void {
    // Aquí podrías, por ejemplo, hacer que el componente se imprima automáticamente
    // al inicializarse si ese es el comportamiento deseado al "finalizar grabado".
    // this.printTicket();
  }

  // Si el botón de imprimir está dentro de este componente
  // printTicket() {
  //   window.print();
  // }
}
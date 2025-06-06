import { Component, Input, OnInit } from '@angular/core';

// Define una interfaz para la estructura de tus datos del evento
export interface EventTicketData {
  evento: string;
  fecha: string;
  hora: string;
  talla: string;
  precio: string;
  numTicket: string;
  codigo: string;
  anticipo: string;
  restante: string;
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
    evento: '',
    fecha: '',
    hora: '',
    talla: '',
    precio: '',
    numTicket: '',
    codigo: '',
    anticipo: '',
    restante: ''
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
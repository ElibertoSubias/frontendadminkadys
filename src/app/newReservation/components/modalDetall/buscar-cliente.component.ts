import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, inject, model, Optional, signal, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { environment } from '../../../../environments/environment';
import { MoviesService } from '../../../services/movies.service';
import Swal from 'sweetalert2';
import { NgIf, NgFor } from '@angular/common';


export interface ModalBuscarCliente {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'buscar-cliente',
  templateUrl: 'buscar-cliente.component.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatCardModule,
    NgIf,
    NgFor,
    ReactiveFormsModule
  ]
})
export class BuscarClienteDialog implements AfterViewInit{

  clienteForm: FormGroup;
  clienteSeleccionado: any = null;

  constructor(
    private moviesService : MoviesService,
    private router: Router,
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public dataReturn: any
  ) { 
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      direccion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    })
  }

  @ViewChild('txtFiltroNombre') txtFiltroNombre!: ElementRef;

  readonly dialogRef = inject(MatDialogRef<BuscarClienteDialog>);
  data = inject(MAT_DIALOG_DATA);

  @ViewChild('txtNombre') txtNombre!:ElementRef;
  @ViewChild('txtDireccion') txtDireccion!:ElementRef;
  @ViewChild('txtTelefono') txtTelefono!:ElementRef;

  nombre: string = "";
  direccion: string = "";
  telefono: string = "";
  baseUrl: string = environment.appBaseUrlMedia;
  diasCobrados: number = 0;
  costoExtra: number = 0;
  tipoComprobante: number = 0;
  cantGarantia: number = 0;
  clientes: any = [];
  flagCrearCliente = false;

  ngAfterViewInit(): void {
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  buscarCliente(): void {
    if (this.txtFiltroNombre.nativeElement.value.length == 0) {
      this.clientes = [];
      return;
    }
    this.moviesService.getBuscarCliente(this.txtFiltroNombre.nativeElement.value).subscribe({
      next: (event: any) => {
        this.clientes = event.result;
      },
      error: (err: any) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "No se encontrarón resultados!",
          showConfirmButton: false,
          timer: 2500
        });
      },
    });
  }

  crearCliente() {
    this.clientes = [];
    this.txtFiltroNombre.nativeElement.value = "";
    this.flagCrearCliente = true;

  }

  seleccionarCliente(cliente: any) {
    this.dialogRef.close({event:1,data:cliente});
  }

  grabarCliente() {
    this.moviesService.grabarClienteNuevo(this.clienteForm.value).subscribe({
      next: (event: any) => {
        this.clienteSeleccionado = event.result;
        this.seleccionarCliente(event.result);
      },
      error: (err: any) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error al crear cliente, intenta de nuevo!",
          showConfirmButton: false,
          timer: 2500
        });
      },
    });
  }

}

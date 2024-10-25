import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, model, signal, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';
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
import { NgIf } from '@angular/common';


export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'modalDetalle.component.html',
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
    NgIf
  ]
})
export class DialogDataExampleDialog implements AfterViewInit{

  constructor(
    private moviesService : MoviesService,
    private router: Router
  ) { }

  @ViewChild('txtDias') txtDias!: ElementRef;
  @ViewChild('txtCostoExtra') txtCostoExtra!: ElementRef;
  @ViewChild('txtTipoComprobante') txtTipoComprobante!: ElementRef;
  @ViewChild('txtCantGarantia') txtCantGarantia!:ElementRef;

  readonly dialogRef = inject(MatDialogRef<DialogDataExampleDialog>);
  data = inject(MAT_DIALOG_DATA);

  baseUrl: string = environment.appBaseUrlMedia;
  diasCobrados: number = 0;
  costoExtra: number = 0;
  tipoComprobante: number = 0;
  cantGarantia: number = 0;

  ngAfterViewInit(): void {
    if (this.data.tipoLlamado == 2) {
      this.diasCobrados = this.txtDias.nativeElement.value = this.data.diasConRetrazo;
      this.costoExtra = this.txtCostoExtra.nativeElement.value = this.data.totalPorRetrazo;
    }
  }

  cambiarTipoComprobante() {
    this.tipoComprobante = this.txtTipoComprobante.nativeElement.value;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  calcularCosto() {
    this.diasCobrados = this.txtDias.nativeElement.value >= 0 ? this.txtDias.nativeElement.value : 0;
    this.txtCostoExtra.nativeElement.value = this.costoExtra = this.diasCobrados * 50;
  }

  darEntrada(): void {
    this.moviesService.darEntrada(this.data._id, this.diasCobrados, this.costoExtra).subscribe({
      next: (event: any) => {
        if (event.status) {
          this.dialogRef.close();
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        }
      },
      error: (err: any) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Ocurrio un error al cargar reporte!",
          showConfirmButton: false,
          timer: 2500
        });
      },
    });
  }

  darSalida(): void {
    if (this.tipoComprobante == 0) {
      Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Favor de capturar Tipo de Comprobante!",
          showConfirmButton: false,
          timer: 2500
      });
      return;
    }
    this.cantGarantia = this.tipoComprobante == 2 ? this.txtCantGarantia.nativeElement.value : 0;
    this.moviesService.darSalida(this.data._id, this.tipoComprobante, this.cantGarantia).subscribe({
      next: (event: any) => {
        if (event.status) {
          this.dialogRef.close();
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        }
      },
      error: (err: any) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Ocurrio un error al cargar reporte!",
          showConfirmButton: false,
          timer: 2500
        });
        this.router.navigate([`/login`]);
      },
    });
  }
}

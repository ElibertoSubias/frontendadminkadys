import { AfterViewInit, Component, ElementRef, OnInit, inject, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Genre } from '../../interfaces/Genre';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MoviesService } from '../../services/movies.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { BuscarClienteDialog } from './modalDetall/buscar-cliente.component';

@Component({
  selector: 'app-workspace',
  templateUrl: './newReservation.component.html',
  styleUrls: ['./newReservation.component.scss']
})
export class NewReservationComponent implements OnInit, AfterViewInit {

  movieForm: FormGroup;
  dialog = inject(MatDialog);

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private moviesService : MoviesService,
    private router: Router,
    private location: Location,
    private cookies : CookieService,
    private apiService : ApiService
  ){
    this.movieForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      numCliente: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      fechaEvento: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      talla: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      fechaRecoleccion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      anticipo: ['', [Validators.required, Validators.min(0), Validators.max(1000)]],
      cantRestante: ['', [Validators.required, Validators.min(0), Validators.max(1000)]],
      comentarios: ['', [Validators.required, Validators.minLength(0), Validators.maxLength(300)]]
    })
  }

  ngAfterViewInit(): void {
    document.getElementById("txtFechaEvento")?.setAttribute("min", this.formatDate(this.currentDate));
    document.getElementById("txtFechaRecoleccion")?.setAttribute("min", this.formatDate(this.currentDate));
  }

  @ViewChild('txtNumCliente') txtNumCliente!:ElementRef;
  @ViewChild('txtCodigo') txtCodigo!:ElementRef;
  @ViewChild('txtFechaEvento') txtFechaEvento!:ElementRef;
  @ViewChild('txtTalla') txtTalla!:ElementRef;
  @ViewChild('txtNombre') txtNombre!:ElementRef;
  @ViewChild('txtApPaterno') txtApPaterno!:ElementRef;
  @ViewChild('txtApMaterno') txtApMaterno!:ElementRef;
  @ViewChild('txtDireccion') txtDireccion!:ElementRef;
  @ViewChild('txtTelefono') txtTelefono!:ElementRef;
  @ViewChild('txtFechaRecoleccion') txtFechaRecoleccion!:ElementRef;
  @ViewChild('txtTipoComprobante') txtTipoComprobante!:ElementRef;
  @ViewChild('txtAnticipo') txtAnticipo!:ElementRef;
  @ViewChild('txtCantRestante') txtCantRestante!: ElementRef;
  @ViewChild('txtCantGarantia') txtCantGarantia!:ElementRef;
  @ViewChild('txtComentarios') txtComentarios!: ElementRef;
  @ViewChild('cbDiasExtras') cbDiasExtras!: ElementRef;
  @ViewChild('txtDias') txtDias!: ElementRef;
  @ViewChild('txtCostoExtra') txtCostoExtra!:ElementRef;

  numCliente: string = "";
  codigo: string = "";
  fechaEvento: string = "";
  talla: string = "";
  nombre: string = "";
  apPaterno: string = "";
  apMaterno: string = "";
  direccion: string = "";
  telefono: string = "";
  fechaRecoleccion: string = "";
  tipoComprobante: string = "";
  anticipo: number = 0;
  cantRestante: number = 0;
  cantGarantia: number = 0;
  comentarios: string = "";
  dress: any = null;
  baseUrl: string = environment.appBaseUrlMedia;
  imagenUrl: string = "";
  totalDisponible: number = 0;
  currentDate: any = new Date();
  reservation: any = null;
  aggDiasExtras: boolean = false;
  diasCobrados: number = 0;
  costoExtra: number = 0;

  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status
  file?: File;

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.moviesService.getMovie(this.route.snapshot.params['id']).subscribe({
        next: (event: any) => {
          this.dress = event.dressExistente;
          this.movieForm.patchValue({
            codigo: event.dressExistente.idDress,
            talla: event.dressExistente.talla
          });
        },
        error: (err: any) => {
          if (err.status == 401) {
            this.apiService.logout();
          } else {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Ocurrio un error al obtener vestido!",
              showConfirmButton: false,
              timer: 2500
            });
          }
        },
      });
    } else if (this.route.snapshot.params['_id']) {
      this.moviesService.getReservation(this.route.snapshot.params['_id']).subscribe({
        next: (event: any) => {
          this.reservation = event.reservation;
          this.dress = this.reservation.vestidos;
          this.movieForm.patchValue({
            codigo: this.reservation.vestidos.idDress,
            numCliente: this.reservation.cliente.numCliente,
            fechaEvento: this.reservation.fechaEvento,
            talla: this.reservation.talla,
            anticipo: this.reservation.anticipo,
            cantRestante: this.reservation.cantRestante,
            cantGarantia: this.reservation.cantGarantia,
            tipoComprobante: this.reservation.tipoComprobante,
            comentarios: this.reservation.comentarios,
            fechaRecoleccion: this.reservation.fechaRecoleccion
          });
          this.nombre = this.reservation.cliente.nombre;
          this.direccion = this.reservation.cliente.direccion;
          this.telefono = this.reservation.cliente.telefono;
          if (this.reservation.diasCobrados > 0) {
            this.aggDiasExtras = true;
            setTimeout(() => {
              this.txtDias.nativeElement.value = this.reservation.diasCobrados;
              this.txtCostoExtra.nativeElement.value = this.reservation.costoExtra;
            }, 500);
          }
        },
        error: (err: any) => {
          if (err.status == 401) {
            this.apiService.logout();
          }
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ocurrio un error la reservacion!",
            showConfirmButton: false,
            timer: 2500
          });
        },
      });
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(BuscarClienteDialog, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.movieForm.patchValue({
        numCliente: result.data.numCliente
      });
      this.nombre = result.data.nombre;
      this.direccion = result.data.direccion;
      this.telefono = result.data.telefono;
    });
  }

  diasExtras() {
    this.aggDiasExtras = this.cbDiasExtras.nativeElement.checked;
  }

  calcularCosto() {
    this.diasCobrados = this.txtDias.nativeElement.value >= 0 ? this.txtDias.nativeElement.value : 0;
    this.txtCostoExtra.nativeElement.value = this.costoExtra = this.diasCobrados * 50;
  }

  formatDate(d: Date) {
    let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
  }

  goBack() {
    this.location.back();
  }

  checkDateEvent() {
    if (this.txtCodigo.nativeElement.value == "") {
      setTimeout(() => this.txtCodigo.nativeElement.focus(), 0);
      return;
    }
    this.moviesService.checkDateEvent(this.movieForm.value.fechaEvento, this.dress.idDress, this.movieForm.value.talla).subscribe({
      next: (data: any) => {
        if (data.reservations.length > 0) {
          this.movieForm.controls['fechaEvento'].reset();
          Swal.fire("Vestido no disponible para esta fecha!");
        } else {
          this.totalDisponible = 1;
        }
      },
      error: (err: any) => {
        if (err.status == 401) {
          this.router.navigate([`/login`]);
        }
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Ocurrio un error al consultar fecha, intenta de nuevo!",
          showConfirmButton: false,
          timer: 1500
        });
        this.movieForm.value.fecha = "";
        console.log(err);
      },
      complete: () => {
        // this.currentFile = undefined;
      },
    });
  }

  addReservation() {
    this.movieForm.value.fecha = this.formatDate(this.currentDate);
    if (this.cbDiasExtras.nativeElement.checked && this.txtDias.nativeElement.value && this.txtDias.nativeElement.value > 0) {
      this.movieForm.value.dias = this.txtDias.nativeElement.value;
      this.movieForm.value.costoExtra = this.txtCostoExtra.nativeElement.value;
    }
    this.moviesService.saveReservation(this.movieForm.value).subscribe({
      next: (event: any) => {
        Swal.fire("Reservacion creada con exito!");
        this.movieForm.reset();
      },
      error: (err: any) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Ocurrio un error al crear la reservacion, intenta de nuevo!",
          showConfirmButton: false,
          timer: 2500
        });
        console.log(err);
      }
    });
  }

  editReservation() {
    if (this.cbDiasExtras.nativeElement.checked && this.txtDias.nativeElement.value && this.txtDias.nativeElement.value > 0) {
      this.movieForm.value.dias = this.txtDias.nativeElement.value;
      this.movieForm.value.costoExtra = this.txtCostoExtra.nativeElement.value;
    }
    this.moviesService.editReservation(this.route.snapshot.params['_id'], this.movieForm.value).subscribe({
      next: (event: any) => {
        Swal.fire("Reservacion actualizada con exito!");
        this.movieForm.reset();
        this.router.navigate([`/reports`]);
      },
      error: (err: any) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Ocurrio un error al crear la reservacion, intenta de nuevo!",
          showConfirmButton: false,
          timer: 2500
        });
        console.log(err);
      }
    });
  }

  searchDress() {
    // this.idDress = this.movieForm.value.codigo;
    if (this.movieForm.value.codigo.length == 0) {
      return;
    }
    this.moviesService.getMovie(this.movieForm.value.codigo).subscribe({
      next: (event: any) => {
        this.dress = event.dressExistente;
        this.movieForm.patchValue({
          codigo: event.dressExistente.idDress,
          talla: event.dressExistente.talla
        });
      },
      error: (err: any) => {
        if (err.status == 401) {
          this.router.navigate([`/login`]);
        }
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Ocurrio un error al obtener vestido",
          showConfirmButton: false,
          timer: 1500
        });
        this.movieForm.patchValue({
          codigo: ''
        });
      },
    });
  }

  onChange(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.status = "initial";
      this.file = file;
    }
  }

}

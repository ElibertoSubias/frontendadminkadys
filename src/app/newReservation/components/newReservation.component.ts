import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Genre } from '../../interfaces/Genre';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MoviesService } from '../../services/movies.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-workspace',
  templateUrl: './newReservation.component.html',
  styleUrls: ['./newReservation.component.scss']
})
export class NewReservationComponent implements OnInit {

  movieForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient, 
    private fb: FormBuilder,
    private moviesService : MoviesService,
    private router: Router
  ){
    this.movieForm = this.fb.group({
      idDress: ['', [Validators.required]],
      codigo: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      fechaEvento: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      talla: ['', [Validators.required]],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apPaterno: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apMaterno: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      direccion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    })
  }


  @ViewChild('txtCodigo') txtCodigo!:ElementRef;
  @ViewChild('txtFechaEvento') txtFechaEvento!:ElementRef;
  @ViewChild('txtTalla') txtTalla!:ElementRef;
  @ViewChild('txtNombre') txtNombre!:ElementRef;
  @ViewChild('txtApPaterno') txtApPaterno!:ElementRef;
  @ViewChild('txtApMaterno') txtApMaterno!:ElementRef;
  @ViewChild('txtDireccion') txtDireccion!:ElementRef;

  codigo: string = "";
  fechaEvento: string = "";
  talla: string = "";
  nombre: string = "";
  apPaterno: string = "";
  apMaterno: string = "";
  direccion: string = "";
  idDress: number = 0;
  vestido: any = null;
  vestidoStock: any = null;
  baseUrl: string = environment.appBaseUrlMedia;
  imagenUrl: string = "";

  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status
  file?: File;

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.idDress = this.route.snapshot.params['id'];
      this.moviesService.getMovie(this.idDress).subscribe({
        next: (event: any) => {
          this.vestidoStock = event.dressExistente;
          this.idDress = event.dressExistente._id;
          this.imagenUrl = event.dressExistente.imagenUrl
          this.movieForm.patchValue({
            codigo: event.dressExistente.idDress,
            idDress: event.dressExistente._id
          });
        },
        error: (err: any) => {
          console.log(err);
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ocurrio un error al obtener vestido!",
            showConfirmButton: false,
            timer: 1500
          });
        },
      });
    }
  }

  checkDateEvent() {
    this.moviesService.checkDateEvent(this.movieForm.value.fechaEvento, this.idDress.toString()).subscribe({
      next: (data: any) => {
        this.vestido = Object.assign({}, this.vestidoStock);
        for (let dress of data.dresses) {
          if (dress.talla == "S") {
            this.vestido.stockSDisponible--;
          } else if (dress.talla == "M") {
            this.vestido.stockMDisponible--;
          } else if (dress.talla == "L") {
            this.vestido.stockLDisponible--;
          } else if (dress.talla == "XL") {
            this.vestido.stockXLDisponible--;
          }
        }
      },
      error: (err: any) => {
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
          timer: 1500
        });
        console.log(err);
      }
    });
  }

  searchDress() {
    this.idDress = this.movieForm.value.codigo;
    this.moviesService.getMovie(this.idDress).subscribe({
      next: (event: any) => {
        this.vestidoStock = event.dressExistente;
        this.idDress = event.dressExistente._id;
        this.imagenUrl = event.dressExistente.imagenUrl;
        this.movieForm.patchValue({
          codigo: event.dressExistente.idDress,
          idDress: event.dressExistente._id
        });
      },
      error: (err: any) => {
        console.log(err);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Ocurrio un error al obtener vestido",
          showConfirmButton: false,
          timer: 1500
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

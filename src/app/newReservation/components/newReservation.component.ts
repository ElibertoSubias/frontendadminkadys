import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Genre } from '../../interfaces/Genre';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MoviesService } from '../../services/movies.service';

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

  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status
  file?: File;

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.idDress = this.route.snapshot.params['id'];
      this.moviesService.getMovie(this.idDress).subscribe({
        next: (event: any) => {
          this.vestidoStock = event.dressExistente;
          this.idDress = event.dressExistente._id;
          this.movieForm.patchValue({
            codigo: event.dressExistente.idDress,
            idDress: event.dressExistente._id
          });
        },
        error: (err: any) => {
          console.log(err);
          alert("Ocurrio un error al obtener vestido");
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
        alert("Ocurrio un error al crear la pelicula, intenta de nuevo.");
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
        this.movieForm.reset();
      },
      error: (err: any) => {
        alert("Ocurrio un error al crear la pelicula, intenta de nuevo.");
        console.log(err);
      },
      complete: () => {
        // this.currentFile = undefined;
      },
    });
  }

  searchDress() {
    this.idDress = this.movieForm.value.codigo;
    this.moviesService.getMovie(this.idDress).subscribe({
      next: (event: any) => {
        this.vestidoStock = event.dressExistente;
        this.idDress = event.dressExistente._id;
        this.movieForm.patchValue({
          codigo: event.dressExistente.idDress,
          idDress: event.dressExistente._id
        });
      },
      error: (err: any) => {
        console.log(err);
        alert("Ocurrio un error al obtener vestido");
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

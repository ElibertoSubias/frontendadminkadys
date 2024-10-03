import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Genre } from '../../interfaces/Genre';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MoviesService } from '../../services/movies.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './addMovie.component.html',
  styleUrls: ['./addMovie.component.scss']
})
export class AddMovieComponent implements OnInit {

  movieForm: FormGroup;

  constructor(
    private http: HttpClient, 
    private fb: FormBuilder,
    private moviesService : MoviesService,
    private router: Router
  ){
    this.movieForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(400)]],
      color: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(400)]],
      stockS: ['', [Validators.required]],
      stockM: ['', [Validators.required]],
      stockL: ['', [Validators.required]],
      stockXL: ['', [Validators.required]],
      categorias: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      imagenUrl: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    })
  }


  @ViewChild('txtTitulo') txtTitulo!:ElementRef;
  @ViewChild('txtDescripcion') txtDescripcion!:ElementRef;
  @ViewChild('txtColor') txtColor!:ElementRef;
  @ViewChild('txtStockS') txtStockS!:ElementRef;
  @ViewChild('txtStockM') txtStockM!:ElementRef;
  @ViewChild('txtStockL') txtStockL!:ElementRef;
  @ViewChild('txtStockXL') txtStockXL!:ElementRef;
  @ViewChild('txtCategoria') txtCategoria!:ElementRef;
  @ViewChild('fileImagenUrl') fileImagenUrl!:ElementRef;
  @ViewChild('txtPrecio') txtPrecio!:ElementRef;

  titulo: string = "";
  descripcion: string = "";
  color: string = "";
  stockS: string = "";
  stockM: string = "";
  stockL: string = "";
  stockXL: string = "";
  categoria: string = "";
  categorias: String[] = [];
  imagenUrl: string = "";
  precio: string = "";

  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status
  file?: File;

  ngOnInit(): void {

  }

  saveMovie() {
    this.movieForm.value.categorias = this.categorias;
    this.movieForm.value.imagenUrl = this.file?.name;
    this.moviesService.saveMovie(this.movieForm.value).subscribe({
      next: (event: any) => {
        
        // Subimos portada en caso de ser grabada con exito la pelicula
        this.onUpload(event.dress._id);
        
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

  onChange(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.status = "initial";
      this.file = file;
    }
  }

  addPortada() {
    this.fileImagenUrl?.nativeElement.click();
  }

  onUpload(id: string) {
    if (this.file) {
      const formData = new FormData();
  
      formData.append('archivo', this.file, this.file.name);
  
      this.moviesService.uploadImage(formData, id).subscribe({
        next: (event: any) => {
          
          // Correcto
          this.router.navigate([`/home`]);
          
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
  }

  addGenre() {
    if (this.txtCategoria?.nativeElement.value) {
      this.categorias.push(this.txtCategoria?.nativeElement.value);
      this.txtCategoria.nativeElement.value = "";
    } else {
      this.txtCategoria?.nativeElement.focus();
    }
  }

  deleteGenre(idItem: String) {
    this.categorias = this.categorias.filter(item => item !== idItem)
  }

}

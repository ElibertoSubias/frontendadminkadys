import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { Genre } from '../../interfaces/Genre';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MoviesService } from '../../services/movies.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './editMovie.component.html',
  styleUrls: ['./editMovie.component.scss']
})
export class EditMovieComponent implements OnInit {

  movieForm: FormGroup;
  movie: any = {};
  idDress: number = 0;
  id: string = "";

  constructor(
    private route:ActivatedRoute,
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
      imagenUrl: ['', [Validators.required]]
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
  stock: string = "";
  categoria: string = "";
  categorias: String[] = [];
  imagenUrl: string = "";
  precio: string = "";

  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status
  file?: File;

  ngOnInit(): void {
    this.idDress = this.route.snapshot.params['id'];

    this.moviesService.getMovie(this.idDress).subscribe({
      next: (event: any) => {
        this.movie = event.dressExistente;
        this.id = this.movie._id;
        this.categorias = this.movie.categorias;
        this.movieForm.patchValue({
          titulo: this.movie.titulo,
          descripcion: this.movie.descripcion,
          color: this.movie.color,
          stock: this.movie.stock,
          imagenUrl: this.movie.imagenUrl,
          precio: this.movie.precio,
          categorias: this.movie.categorias
        });
      },
      error: (err: any) => {
        console.log(err);
        alert("Ocurrio un error al obtener la pelicula");
      },
    });
  }

  saveMovie() {
    this.movieForm.value.categorias = this.categorias;
    this.movieForm.value.imagenUrl = this.file ? this.file.name : this.movieForm.value.imagenUrl;
    this.moviesService.updateMovie(this.movieForm.value, this.id).subscribe({
      next: (event: any) => {
        
        // Subimos portada en caso de ser grabada con exito la pelicula
        if (this.file) {
          this.onUpload(event.dress._id);
        } else {
          this.router.navigate([`/movie/${this.idDress}`]);
        }
        
      },
      error: (err: any) => {
        console.log(err);
        alert("Ocurrio un error al actualizar la pelicula, intenta de nuevo.");
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
          this.router.navigate([`/movie/${this.idDress}`]);
          
        },
        error: (err: any) => {
          console.log(err);
          alert("Ocurrio un error al actualizar la pelicula, intenta de nuevo.");
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

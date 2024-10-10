import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Genre } from '../../interfaces/Genre';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MoviesService } from '../../services/movies.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-workspace',
  templateUrl: './addItem.component.html',
  styleUrls: ['./addItem.component.scss']
})
export class AddItemComponent implements OnInit {

  dressForm: FormGroup;

  constructor(
    private http: HttpClient, 
    private fb: FormBuilder,
    private moviesService : MoviesService,
    private router: Router
  ){
    this.dressForm = this.fb.group({
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

  saveItem() {
    this.dressForm.value.categorias = this.categorias;
    this.dressForm.value.imagenUrl = this.file?.name;
    this.moviesService.saveMovie(this.dressForm.value).subscribe({
      next: (event: any) => {
        
        // Subimos portada en caso de ser grabada con exito
        this.onUpload(event.dress._id);
        
      },
      error: (err: any) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Ocurrio un error al crear vestido, intenta de nuevo!",
          showConfirmButton: false,
          timer: 1500
        });
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
          Swal.fire({
            title: "Vestido creado con exito!",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "Ok"
          }).then((result) => {
            this.router.navigate([`/home`]);
          });
        },
        error: (err: any) => {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ocurrio un error al grabar imagen, intenta de nuevo!",
            showConfirmButton: false,
            timer: 1500
          });
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
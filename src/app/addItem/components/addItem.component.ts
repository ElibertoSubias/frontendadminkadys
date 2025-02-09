import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Genre } from '../../interfaces/Genre';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MoviesService } from '../../services/movies.service';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../../services/api.service';

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
    private router: Router,
    private cookies : CookieService,
    private apiService : ApiService
  ){
    this.dressForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(400)]],
      color: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      talla: ['', [Validators.required, Validators.min(0), Validators.max(1000)]],
      categorias: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      // imagenUrl: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    })
  }


  @ViewChild('txtCodigo') txtCodigo!:ElementRef;
  @ViewChild('txtDescripcion') txtDescripcion!:ElementRef;
  @ViewChild('txtColor') txtColor!:ElementRef;
  @ViewChild('txtTalla') txtTalla!:ElementRef;
  @ViewChild('txtCategoria') txtCategoria!:ElementRef;
  @ViewChild('fileImagenUrl') fileImagenUrl!:ElementRef;
  @ViewChild('txtPrecio') txtPrecio!:ElementRef;

  codigo: string = "";
  descripcion: string = "";
  color: string = "";
  talla: number = 0;
  categoria: string = "";
  categorias: String[] = [];
  imagenUrl: string = "";
  precio: string = "";
  nextID: number = 0;
  isLoading: boolean = false;

  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status
  file?: File;

  ngOnInit(): void {
    this.moviesService.getNextID().subscribe({
      next: (event: any) => {
        this.nextID = event.nextID;
        this.dressForm.controls['codigo'].setValue(this.nextID);
        // this.dressForm.controls['codigo'].disable();
      },
      error: (err: any) => {
        if (err.status == 401) {
          this.apiService.logout();
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ocurrio un error al obtener siguiente codigo!",
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
    });
  }

  saveItem() {
    this.isLoading = true;
    this.dressForm.controls['codigo'].enable();
    this.moviesService.checkCodeAvailable(this.dressForm.value.codigo).subscribe({
      next: (event: any) => {
        if (event.codeValid) {
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
                timer: 2500
              });
              console.log(err);
              this.isLoading = false;
            },
            complete: () => {
              // this.currentFile = undefined;
            },
          });
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "El codigo ya esta registrado!",
            showConfirmButton: false,
            timer: 2500
          });
          this.isLoading = false;
        }
      },
      error: (err: any) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Ocurrio un error al validar codigo, intenta de nuevo!",
          showConfirmButton: false,
          timer: 2500
        });
        this.isLoading = false;
      }
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
            this.isLoading = false;
            this.router.navigate([`/home`]);
          });
        },
        error: (err: any) => {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ocurrio un error al grabar imagen, intenta de nuevo!",
            showConfirmButton: false,
            timer: 2500
          });
          console.log(err);
        },
        complete: () => {
          // this.currentFile = undefined;
          this.isLoading = false;
        },
      });
    } else {
      // Correcto
      Swal.fire({
        title: "Vestido creado con exito!",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "Ok"
      }).then((result) => {
        this.isLoading = false;
        this.router.navigate([`/home`]);
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

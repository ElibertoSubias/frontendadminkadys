import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { Genre } from '../../interfaces/Genre';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MoviesService } from '../../services/movies.service';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-workspace',
  templateUrl: './editItem.component.html',
  styleUrls: ['./editItem.component.scss']
})
export class EditItemComponent implements OnInit {

  dressForm: FormGroup;
  dress: any = {};
  id: string = "";
  baseUrl: string = environment.appBaseUrlMedia;

  constructor(
    private route:ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private moviesService : MoviesService,
    private router: Router
  ){
    this.dressForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
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


  @ViewChild('txtCodigo') txtCodigo!:ElementRef;
  @ViewChild('txtDescripcion') txtDescripcion!:ElementRef;
  @ViewChild('txtColor') txtColor!:ElementRef;
  @ViewChild('txtStockS') txtStockS!:ElementRef;
  @ViewChild('txtStockM') txtStockM!:ElementRef;
  @ViewChild('txtStockL') txtStockL!:ElementRef;
  @ViewChild('txtStockXL') txtStockXL!:ElementRef;
  @ViewChild('txtCategoria') txtCategoria!:ElementRef;
  @ViewChild('fileImagenUrl') fileImagenUrl!:ElementRef;
  @ViewChild('txtPrecio') txtPrecio!:ElementRef;

  codigo: string = "";
  descripcion: string = "";
  color: string = "";
  stockS: string = "";
  stockM: string = "";
  stockL: string = "";
  stockXL: string = "";
  categoria: string = "";
  categorias: String[] = [];
  imagenUrl: string = "";
  imageUrlActualizar: any = null;
  precio: string = "";

  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status
  file?: File;

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.moviesService.getMovie(this.id).subscribe({
      next: (event: any) => {
        this.dress = event.dressExistente;
        // this.id = this.dress._id;
        this.categorias = this.dress.categorias;
        this.dressForm.patchValue({
          codigo: this.dress.idDress,
          descripcion: this.dress.descripcion,
          color: this.dress.color,
          stockS: this.dress.stockS,
          stockM: this.dress.stockM,
          stockL: this.dress.stockL,
          stockXL: this.dress.stockXL,
          imagenUrl: this.dress.imagenUrl,
          precio: this.dress.precio,
          categorias: this.dress.categorias
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

  saveItem() {
    this.dressForm.value.categorias = this.categorias;
    this.dressForm.value.imagenUrl = this.file ? this.file.name : this.dressForm.value.imagenUrl;
    this.moviesService.updateMovie(this.dressForm.value, this.dress._id).subscribe({
      next: (event: any) => {

        // Subimos portada en caso de ser grabada con exito
        if (this.file) {
          this.onUpload(event.dress._id);
        } else {
          Swal.fire({
            title: "Informacion grabada con exito!",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "Ok"
          }).then((result) => {
            this.router.navigate([`/dress/${this.id}`]);
          });
        }

      },
      error: (err: any) => {
        console.log(err);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: err.error.msg,
          showConfirmButton: false,
          timer: 1500
        });
      },
    });
  }

  onChange(event: any) {
    const file: File = event.target.files[0];
    this.imageUrlActualizar = URL.createObjectURL(file)
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
            title: "Informacion grabada con exito!",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "Ok"
          }).then((result) => {
            this.router.navigate([`/dress/${this.id}`]);
          });

        },
        error: (err: any) => {
          console.log(err);
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ocurrio un error al grabar imagen, intenta de nuevo!",
            showConfirmButton: false,
            timer: 1500
          });
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

import {ChangeDetectionStrategy, Component, inject, model, signal} from '@angular/core';
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
    MatCardModule
  ]
})
export class DialogDataExampleDialog {

  constructor(
    private moviesService : MoviesService,
    private router: Router
  ){}

  readonly dialogRef = inject(MatDialogRef<DialogDataExampleDialog>);
  data = inject(MAT_DIALOG_DATA);
  baseUrl: string = environment.appBaseUrlMedia;

  onNoClick(): void {
    this.dialogRef.close();
  }

  darSalida(): void {
    this.moviesService.darSalida(this.data._id).subscribe({
      next: (event: any) => {
        if (event.status) {
          this.dialogRef.close();
          // this.router.navigate([`/reports/out-for-today`]);
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
}

import { AfterViewInit, Component, ElementRef, OnInit, viewChild, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../../../services/movies.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  @ViewChild('txtFiltro') txtFiltro:ElementRef | undefined;
  nombreUser: string = "";

  showFilter: boolean = true;

  constructor(
    public router: Router,
    private moviesService : MoviesService,
    private route: ActivatedRoute,
    private apiService : ApiService
  ) {
    router.events.subscribe((val) => {
      if (this.router.url.indexOf('/home') > -1) {
        this.showFilter = true;
      } else {
        this.showFilter = false;
      }
    });
  }
  ngAfterViewInit(): void {
    if (this.route.snapshot.queryParams['filter']) {
      this.txtFiltro!.nativeElement.value = this.route.snapshot.queryParams['filter'];
    }
  }

  ngOnInit(): void {
    this.nombreUser = this.apiService.getUser("userName");
  }

  filterMovies() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(
      ['/home'],
      { queryParams: { filter: this.txtFiltro?.nativeElement.value } }
    );
  }

  salir() {
    this.apiService.logout();
    this.router.navigate([`/login`]);
  }

}

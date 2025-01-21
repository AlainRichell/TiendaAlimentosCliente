import { Component, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ViewportScroller } from '@angular/common';
import { routes } from './app/app.routes';
import { NavbarComponent } from './app/components/navbar/navbar.component';
import { FooterComponent } from './app/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="flex flex-col min-h-screen">
      <app-navbar></app-navbar>
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
})
export class App {
  name = 'Style Boutique';

  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);

  constructor() {
    // Escucha cambios de ruta y ajusta el scroll al inicio
    this.router.events.subscribe(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ],
}).catch(err => console.error(err));

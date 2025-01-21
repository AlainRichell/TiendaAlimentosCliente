import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ref-handler',
  standalone: true, // Declarar el componente como standalone
  imports: [CommonModule], // Importar los módulos necesarios
  template: ''
})
export class RefHandlerComponent {
  constructor(private route: ActivatedRoute, private router: Router) {
    // Captura el parámetro de la ruta
    this.route.params.subscribe(params => {
      const codigo = params['codigo'];
      if (codigo) {
        // Guarda el código en el localStorage
        localStorage.setItem('codigo_ref', codigo);
      }
      // Redirige a la ruta principal
      this.router.navigate(['/']);
    });
  }
}


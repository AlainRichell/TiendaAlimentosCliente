import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-rose-950 text-white mt-auto">
      <div class="container-custom py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">Gustare</h3>
            <p class="text-gray-400">Haciendo su paladar sentir el gusto.</p>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-4">Enlaces</h3>
            <ul class="space-y-2">
              <li><a routerLink="/" class="text-gray-400 hover:text-white">Inicio</a></li>
              <li><a routerLink="/products" class="text-gray-400 hover:text-white">Productos</a></li>
              <li><a routerLink="/about" class="text-gray-400 hover:text-white">Nosotros</a></li>
              <li><a routerLink="/contact" class="text-gray-400 hover:text-white">Contacto</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-4">Servicio al cliente</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 hover:text-white">Política de envío</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Cambios y devoluciones</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Preguntas frecuentes</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Guía de compra</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-4">Conéctate con nosotros</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 hover:text-white">Facebook</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Instagram</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Twitter</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Pinterest</a></li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-neutral-400 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Gustare. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
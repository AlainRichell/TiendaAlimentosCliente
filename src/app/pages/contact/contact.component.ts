import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pt-16 container-custom py-8">
      <h1 class="text-3xl font-bold mb-8 mt-8">Contáctanos</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold mb-4">Ponte en contacto</h2>
          <form (submit)="onSubmit($event)" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input 
                type="text" 
                class="w-full border rounded-md p-2"
                required>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
              <input 
                type="email" 
                class="w-full border rounded-md p-2"
                required>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
              <textarea 
                class="w-full border rounded-md p-2 h-32"
                required></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary w-full">
              Enviar mensaje
            </button>
          </form>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold mb-4">Información de contacto</h2>
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold mb-2">Dirección</h3>
              <p class="text-gray-600">123 Fashion Street</p>
              <p class="text-gray-600">New York, NY 10001</p>
            </div>
            
            <div>
              <h3 class="font-semibold mb-2">Correo electrónico</h3>
              <p class="text-gray-600">contact&#64;vstore.com</p>
            </div>
            
            <div>
              <h3 class="font-semibold mb-2">Teléfono</h3>
              <p class="text-gray-600">+1 (555) 123-4567</p>
            </div>
            
            <div>
              <h3 class="font-semibold mb-2">Horario laboral</h3>
              <p class="text-gray-600">Lunes - Viernes: 9:00 AM - 6:00 PM</p>
              <p class="text-gray-600">Sábado: 10:00 AM - 4:00 PM</p>
              <p class="text-gray-600">Domingo: Cerrado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContactComponent {
  onSubmit(event: Event) {
    event.preventDefault();
    // Handle form submission
    console.log('Form submitted');
  }
}
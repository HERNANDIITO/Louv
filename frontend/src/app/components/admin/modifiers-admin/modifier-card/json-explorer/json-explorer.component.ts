import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { GlobalLookup } from '../../lookup.util';

@Component({
  selector: 'app-json-explorer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './json-explorer.component.html',
  styleUrl: './json-explorer.component.scss'
})
export class JsonExplorerComponent {
data = input<any>();

  objectEntries() {
    const val = this.data();
    if (!val || typeof val !== 'object') return [];
    
    // Si es un array, devolvemos sus elementos directamente para que el HTML decida cómo mostrarlos
    if (Array.isArray(val)) {
        return val.map((v, index) => ({ key: index, value: v, isArrayElement: true }));
    }

    return Object.entries(val)
      .filter(([key]) => !['_id', '__v'].includes(key))
      .map(([key, value]) => ({ key, value, isArrayElement: false }));
  }

  isObject(val: any): boolean {
    return val !== null && typeof val === 'object';
  }

  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  isNumber(val: any): boolean {
    return typeof val === 'number' || (val?.$numberDecimal);
  }

  formatValue(val: any): string {
    if (typeof val === 'string' && val.length === 24) {
      const name = GlobalLookup.getName(val);
      return name ? name : val; // Si lo encuentra devuelve el nombre, si no, el ID
    }
    return val;
  }  
}

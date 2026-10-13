import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import ENUMS from '../../enums';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss']
})
export class OrderCardComponent {

  faChevronLeft = faChevronLeft;

  @Input() order: any;

  public showDetails: boolean = false;
  public orderStates = ENUMS.ORDER_STATES;

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  hideDetails() {
    this.showDetails = false;
  }

  getUserFullName() {
    if (!this.order?.user) return '';
    return `${this.order.user.name} ${this.order.user.surname}`;
  }

  getFullAddress() {
    const a = this.order?.address;
    if (!a) return '';
    const extra = a.extraInfo ? ` (${a.extraInfo})` : '';
    return `${a.street}${extra}, ${a.locality}, ${a.province}, ${a.country}`;
  }

  getFormattedDate(date: string | Date) {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  getStateClass(state: string): string {
    switch (state) {
      case 'inCart':
        return 'state-in-cart';
      case 'ordered':
        return 'state-ordered';
      case 'delivered':
        return 'state-delivered';
      default:
        return '';
    }
  }
}
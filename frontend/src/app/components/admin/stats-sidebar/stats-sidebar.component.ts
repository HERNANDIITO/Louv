import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChartPie, faTruck, faGear, faHome } from '@fortawesome/free-solid-svg-icons';
import { faGem } from "@fortawesome/free-regular-svg-icons";
import { UserProfileDropwdownComponent } from "../../../shared/user-profile-dropwdown/user-profile-dropwdown.component";


@Component({
  selector: 'app-stats-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FaIconComponent, UserProfileDropwdownComponent],
  templateUrl: './stats-sidebar.component.html',
  styleUrls: ['./stats-sidebar.component.scss']
})
export class StatsSidebarComponent {
    @Input() activeSection: string = 'stats'; 
    menu = ["Estadísticas", "Administración de pedidos", "Modificadores de anillo", "Configuración"];
    faChartPie = faChartPie;
    faTruck = faTruck;
    faGem = faGem;
    faGear = faGear;
    faHome = faHome
}

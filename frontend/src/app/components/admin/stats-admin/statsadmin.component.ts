import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { StatsSidebarComponent } from '../stats-sidebar/stats-sidebar.component';
import { faDownload, faCreditCard, faUsers, faRing, faBoxes } from '@fortawesome/free-solid-svg-icons';
import { faGem } from "@fortawesome/free-regular-svg-icons";
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FacturacionComponent } from "./facturacion/facturacion.component";
import { UsuariosComponent } from "./usuarios/usuarios.component";
import { GemasMetalesComponent } from "./gemas-metales/gemas-metales.component";
import { BasesEngastesComponent } from "./bases-engastes/bases-engastes.component";
import { CajasComponent } from "./cajas/cajas.component";
import * as echarts from 'echarts';
import { NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { StatsAdminService } from '../../../services/stats-admin.service';
import { ExportService } from '../../../services/export.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-statsadmin',
  standalone: true,
  imports: [StatsSidebarComponent, FaIconComponent, FacturacionComponent, UsuariosComponent, GemasMetalesComponent, BasesEngastesComponent, CajasComponent, FormsModule],
  templateUrl: './statsadmin.component.html',
  styleUrls: ['./statsadmin.component.scss'],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: {
        echarts, // librería real
        init: () => echarts.init(document.createElement('div'))
      }
    }
  ]
})
export class StatsadminComponent {

  constructor(
    private statsService: StatsAdminService,
    private exportService: ExportService, 
    private eRef: ElementRef
  ) {}

  currentSectionTitle = 'Panel de estadísticas';
  showDownloadMenu = false;

  // Iconos
  faDownload = faDownload;
  faCreditCard = faCreditCard;
  faUsers = faUsers;
  faGem = faGem;
  faRing = faRing;
  faBoxes = faBoxes;

  selectedSection: string = 'facturacion';
  selectedYear: number = new Date().getFullYear();
  availableYears: number[] = [2026, 2025]; 

  @ViewChild('menuContainer') menuContainer!: ElementRef;

  switchTab(sectionName: string) {
    this.selectedSection = sectionName;
  }

  //EXPORTACIÖN
  toggleDownloadMenu() {
    this.showDownloadMenu = !this.showDownloadMenu;
  }

 @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    // Si el menú está abierto Y el clic NO está contenido en el div del menú
    if (this.showDownloadMenu && !this.menuContainer.nativeElement.contains(event.target)) {
      this.showDownloadMenu = false;
    }
  }

async downloadReport(format: 'pdf' | 'excel') {
  this.showDownloadMenu = false;
  const añoSeleccionado = this.selectedYear;
  this.statsService.getFullReportData(añoSeleccionado).subscribe({
    next: async (allData) => {
      try {
        if (format === 'pdf') {
          await this.exportService.generatePDF(allData, añoSeleccionado);
        } else {
          this.exportService.generateExcel(allData, añoSeleccionado);
        }
      } catch (err) {
        console.error("Error procesando descarga:", err);
      }
    },
    error: (err) => console.error("Error obteniendo datos", err)
  });
}
}
import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from './stat-card/stat-card.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { StatsAdminService } from "../../../../services/stats-admin.service";
import { StatCardData } from '../../../../interfaces/stats/stat-card.interface';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";


@Component({
  selector: 'app-facturacion',
  standalone: true,
  imports: [CommonModule, StatCardComponent, FontAwesomeModule],
  templateUrl: './facturacion.component.html', 
  styleUrls: ['./facturacion.component.scss']
})

export class FacturacionComponent implements OnInit {
  constructor(
    private statsAdminService: StatsAdminService,
    private cdr: ChangeDetectorRef
  ) {}

  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  
  year = new Date().getFullYear();
  month = new Date().getMonth();

  yearCache: Record<number, any[]> = {};
  designYearCache: Record<number, number[]> = {};

  stats: StatCardData[] = [
    { title: "Anillos vendidos", value: '...', change: 0, chartData: [], labels: [] },
    { title: "Ingresos totales", value: '...', change: 0, chartData: [], labels: [] },
    { title: "Precio medio diseños", value: '...', change: 0, chartData: [], labels: [] },
    { title: "Precio medio ventas", value: '...', change: 0, chartData: [], labels: [] }
  ];

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.loadYearData(this.year);
    this.loadYearData(this.year - 1);
    this.loadDesignYearData(this.year);
    this.loadDesignYearData(this.year - 1);
  }

  loadYearData(year: number) {
    this.statsAdminService.getYearlyStats(year).subscribe({
      next: (res) => {
        this.yearCache[year] = res.data;
        this.updateUI();
      },
    error: (err) => console.error("Error en la petición API:", err)
    });
  }

  loadDesignYearData(year: number) {
    this.statsAdminService.getYearlyDesignStats(year).subscribe({
      next: (res) => {
        this.designYearCache[year] = res.data;
        this.updateUI();
      }
    });
  }

  updateUI() {
    const currentYearData = this.yearCache[this.year] || [];
    const prevYearData = this.yearCache[this.year - 1] || [];
    const currentDesignData = this.designYearCache[this.year] || [];
    const prevDesignData = this.designYearCache[this.year - 1] || [];

    // Mes actual
    const curM = currentYearData[this.month] || { totalProductos: 0, ingresosTotales: 0, precioMedio: 0 };
    const curD = currentDesignData[this.month] || 0;

    // Mes anterior
    let prevM, prevD;
    if (this.month === 0) {
      prevM = prevYearData[11] || { totalProductos: 0, ingresosTotales: 0, precioMedio: 0 };
      prevD = prevDesignData[11] || 0;
    } else {
      prevM = currentYearData[this.month - 1] || { totalProductos: 0, ingresosTotales: 0, precioMedio: 0 };
      prevD = currentDesignData[this.month - 1] || 0;
    }

    const calcChange = (curr: number, prev: number) => {
      // Caso 1: Ambos son 0 -> Sin cambios
      if ((curr === 0 || !curr) && (prev === 0 || !prev)) return 0;

      // Caso 2: El mes anterior es 0 pero el actual tiene datos -> 100% de aumento
      if (!prev || prev === 0) return 100;

      // Caso 3: Fórmula estándar
      const res = ((curr - prev) / prev) * 100;
      return parseFloat(res.toFixed(1));
    };

    // Usamos variables locales para que sea más legible
    const ventasVal = curM.totalProductos || 0;
    const ingresosVal = (curM.ingresosTotales || 0).toFixed(2);
    const diseñosVal = (curD || 0).toFixed(2);
    const mediaVentasVal = (curM.precioMedio || 0).toFixed(2);

    const anillosData = this.getLast12Months("totalProductos");
    const ingresosData = this.getLast12Months("ingresosTotales");
    const diseñosData = this.getLast12MonthsDesign();
    const mediaVentasData = this.getLast12Months("precioMedio");

    this.stats = [
      {
        title: "Anillos vendidos",
        value: ventasVal,
        change: calcChange(ventasVal, prevM.totalProductos || 0),
        chartData: anillosData.values,
        labels: anillosData.labels 
      },
      {
        title: "Ingresos totales",
        value: `${ingresosVal} €`,
        change: calcChange(curM.ingresosTotales || 0, prevM.ingresosTotales || 0),
        chartData: ingresosData.values,
        labels: ingresosData.labels
      },
      {
        title: "Precio medio diseños",
        value: `${diseñosVal} €`,
        change: calcChange(curD || 0, prevD || 0),
        chartData: diseñosData.values,
        labels: diseñosData.labels
      },
      {
        title: "Precio medio ventas",
        value: `${mediaVentasVal} €`,
        change: calcChange(curM.precioMedio || 0, prevM.precioMedio || 0),
        chartData: mediaVentasData.values,
        labels: mediaVentasData.labels
      }
    ];

    this.cdr.detectChanges(); 
  }

  getLast12Months(field: any): { values: number[], labels: string[] } {
    const values: number[] = [];
    const labels: string[] = [];
    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    for (let i = 11; i >= 0; i--) {
      let m = this.month - i;
      let y = this.year;
      if (m < 0) { m += 12; y--; }
      
      const monthData = (this.yearCache[y] || [])[m];
      values.push(monthData ? monthData[field] || 0 : 0);
      labels.push(`${nombresMeses[m]} ${y}`); 
    }
    return { values, labels };
  }

  getLast12MonthsDesign(): { values: number[], labels: string[] } {
    const values: number[] = [];
    const labels: string[] = [];
    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    for (let i = 11; i >= 0; i--) {
      let m = this.month - i;
      let y = this.year;
      if (m < 0) { m += 12; y--; }
      
      const valorDesign = (this.designYearCache[y] || [])[m] || 0;
      
      values.push(valorDesign);
      labels.push(`${nombresMeses[m]} ${y}`);
    }

    return { values, labels };
  }

  // Navegación
  prevMonth() {
    if (this.month === 0) {
      this.month = 11;
      this.year--;
      this.initData();
    } else {
      this.month--;
      this.updateUI();
    }
  }

  nextMonth() {
    if (this.month === 11) {
      this.month = 0;
      this.year++;
      this.initData();
    } else {
      this.month++;
      this.updateUI();
    }
  }

  // Devuelve true si el mes mostrado es el actual o futuro
  esFuturo(): boolean {
    const hoy = new Date();
    return this.year > hoy.getFullYear() || 
          (this.year === hoy.getFullYear() && this.month >= hoy.getMonth());
  }
  
  getMonthName = () => ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][this.month];
}
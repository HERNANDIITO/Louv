import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { StatCardData } from '../../../../../interfaces/stats/stat-card.interface';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-stat-card',
  standalone: true,           // <-- Esto lo hace standalone
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})

export class StatCardComponent implements OnChanges {
  @Input() data!: StatCardData;
  chartOption: any;

  // ESTO ES LO QUE HACE QUE LOS DATOS REALES SOBREESCRIBAN AL "1111"
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.renderChart();
    }
  }

  renderChart() {
  if (!this.data || !this.data.chartData || !this.data.labels) return;

  this.chartOption = {
    // 1. CONFIGURACIÓN DEL TOOLTIP (Visual y Datos)
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderWidth: 0,
      textStyle: { color: '#333', fontSize: 12 },
      extraCssText: 'box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-radius: 4px;',
      confine: true,
      formatter: (params: any) => {
        const p = params[0];
        const etiquetaMes = this.data.labels[p.dataIndex]; 
        
        // Forzamos 2 decimales solo si es un número
        const valorFormateado = typeof p.value === 'number' 
          ? p.value.toFixed(2) 
          : p.value;
        
        const unidad = this.data.title.toLowerCase().includes('ingresos') || 
                      this.data.title.toLowerCase().includes('precio') ? '€' : 'anillos';

        return `<div style="padding: 4px">
                  <b style="color: #6b2fb8">${etiquetaMes}</b><br/>
                  ${valorFormateado} ${unidad}
                </div>`;
      }
    },

    // 2. MÁRGENES DE LA GRÁFICA
    grid: { left: 5, right: 5, top: 10, bottom: 10 },

    // 3. EJES (Ocultos pero con datos)
    xAxis: { 
      type: 'category', 
      show: false,
      data: this.data.labels // Labels para que el tooltip sepa qué mes es
    },
    yAxis: { type: 'value', show: false },

    // 4. ESTILO DE LA SERIE (Aquí es donde recuperamos el color morado)
    series: [{
      data: [...this.data.chartData],
      type: 'line',
      symbol: 'circle',
      symbolSize: 4,
      showSymbol: false, // Solo aparece al pasar el ratón (hover)
      itemStyle: { color: '#6b2fb8' },
      lineStyle: { width: 3, color: '#6b2fb8' },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(146, 76, 236, 0.4)' },
            { offset: 1, color: 'rgba(107, 47, 184, 0)' }
          ]
        }
      }
    }]
  };
}
}
import { Component, OnInit } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartItem } from '../../../../interfaces/stats/chart-item.interface';
import { BoxMatCardComponent } from './box-mat-card/box-mat-card.component'; 

@Component({
  selector: 'app-cajas',
  imports: [NgxEchartsModule, BoxMatCardComponent],
  templateUrl: './cajas.component.html',
  styleUrls: ['./cajas.component.scss']
})
export class CajasComponent implements OnInit {

  matInterior: ChartItem[] = [
    { name: 'Clásico', percentage: 30 },
    { name: 'La mar', percentage: 25 },
    { name: 'Bello', percentage: 15 },
    { name: 'Soleado', percentage: 12 },
    { name: 'Dulce', percentage: 7 }
  ];

  matExterior: ChartItem[] = [
    { name: 'Clásico', percentage: 30 },
    { name: 'La mar', percentage: 25 },
    { name: 'Bello', percentage: 15 },
    { name: 'Soleado', percentage: 12 },
    { name: 'Dulce', percentage: 7 }
  ];

  option: any = {
    xAxis: {
      type: 'value',
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {   
      type: 'category',
      data: [],
      axisLabel: {
        show: false
      }
    },
    series: [
      {
        type: 'bar',
        data: [],
        itemStyle: {
          color: (params: any) => {
            const colors = ['#7cd9f8', '#f5f774', '#e6a8ef'];
            return colors[params.dataIndex];
          }
        },
        label: {
          show: true,
          position: 'inside',
          align: 'center',
          verticalAlign: 'middle',
          formatter: (params: any) => {
            return `{percent|${params.value}%}\n{name|${params.name}}`;
          },
          rich: {
            percent: {
              fontSize: 20,
              fontWeight: 'bold',
              color: '#562172'
            },
            name: {
              fontSize: 12,
              color: '#562172'
            }
          }
        }
      }
    ]
  };

  ngOnInit(): void {

    // Datos de prueba (luego vendrán del backend)
    const mockData: ChartItem[] = [
      { name: 'Circular', percentage: 64 },
      { name: 'Corazón', percentage: 20 },
      { name: 'Cuadrada', percentage: 16 }
    ];

    this.updateChart(mockData);
  }

  updateChart(data: ChartItem[]): void {

    const sortedData = [...data].sort((a, b) => a.percentage - b.percentage);
    this.option = {
      ...this.option,
      yAxis: {
        ...this.option.yAxis,
        data: sortedData.map(d => d.name)
      },
      series: [
        {
          ...this.option.series[0],
          data: sortedData.map(d => ({
            value: d.percentage,
            name: d.name
          }))
        }
      ]
    };

  }

}
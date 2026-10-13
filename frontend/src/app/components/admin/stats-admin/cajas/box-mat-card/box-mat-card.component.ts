import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartItem } from '../../../../../interfaces/stats/chart-item.interface';

@Component({
  selector: 'app-box-mat-card',
  standalone: true,
  imports: [NgxEchartsModule],
  templateUrl: './box-mat-card.component.html',
  styleUrls: ['./box-mat-card.component.scss']
})
export class BoxMatCardComponent implements OnChanges {

  @Input() data: ChartItem[] = [];
  @Input() title: string = '';

  option: any = {
    grid: { left: 0, right: 10, top: 20, bottom: 2 },
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
      data: []
    },
    series: [
      {
        type: 'bar',
        data: [],
        itemStyle: {
          color: '#E0ABE8'
        },
        label: {
          show: true,
          position: 'inside',
          align: 'center',
          verticalAlign: 'middle',
          formatter: (params: any) => `{percent|${params.value}%}`,
          rich: {
            percent: {
              fontSize: 16,
              fontWeight: 'bold',
              color: '#562172'
            }
          }
        }
      }
    ]
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data.length) {
      this.updateChart(this.data);
    }
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
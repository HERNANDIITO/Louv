import { Component, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartType, registerables, LegendItem } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-graphic',
  standalone: true,
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.scss']
})
export class GraphicComponent implements AfterViewInit {

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() chartType: ChartType = 'bar';
  @Input() chartLabels: string[] = [];
  @Input() chartData: number[] | { name: string; values: number[] }[] = [];
  @Input() chartTitle: string = '';
  @Input() isTimeSeries: boolean = false;

  private chartInstance!: Chart;

  ngAfterViewInit(): void {
    this.createChart();
  }

  private createChart(): void {
    const isPieLike = this.chartType === 'doughnut' || this.chartType === 'pie';
    let datasets;

    if (isPieLike) {
      datasets = [
        {
          label: this.chartTitle,
          data: this.chartData as number[],
          backgroundColor: this.getBackgroundColors((this.chartData as number[]).length),
          borderWidth: 1
        }
      ];
    } else if (this.chartType === 'line' && this.isTimeSeries) {
      const colors = this.getBackgroundColors((this.chartData as any[]).length);
      datasets = (this.chartData as { name: string; values: number[] }[]).map((d, index) => ({
        label: d.name,
        data: d.values,
        backgroundColor: colors[index],
        borderColor: colors[index],
        borderWidth: 2,
        fill: false,
        tension: 0.3
      }));
    } else if (this.chartType === 'bar') {
      const colors = this.getBackgroundColors((this.chartData as number[]).length);
      datasets = [
        {
          label: this.chartTitle,
          data: this.chartData as number[],
          backgroundColor: colors,
          borderColor: 'rgba(0,0,0,0.2)',
          borderWidth: 1
        }
      ];
    } else {
      datasets = [
        {
          label: this.chartTitle,
          data: this.chartData as number[],
          backgroundColor: this.getBackgroundColors((this.chartData as number[]).length),
          borderWidth: 1,
          fill: this.chartType !== 'line'
        }
      ];
    }

    this.chartInstance = new Chart(this.chartCanvas.nativeElement, {
      type: this.chartType,
      data: {
        labels: this.chartLabels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              generateLabels: (chart) => this.buildLegend(chart)
            }
          },
          title: {
            display: true,
            text: this.chartTitle,
            font: {
              size: 18,
              weight: 'bold'
            }
          }
        },
        scales: !isPieLike ? { y: { beginAtZero: true } } : undefined
      }
    });
  }

  private buildLegend(chart: Chart): LegendItem[] {
    if (this.chartType === 'line' && this.isTimeSeries) {
      return chart.data.datasets.map((ds, i) => ({
        text: ds.label ?? `Serie ${i + 1}`,
        fillStyle: ds.borderColor as string,
        strokeStyle: ds.borderColor as string,
        lineWidth: 2,
        hidden: chart.getDatasetMeta(i).hidden ?? false,
        index: i
      }));
    }

    if (this.chartType === 'bar') {
      const ds = chart.data.datasets[0];
      const labels = chart.data.labels as string[];
      return labels.map((label, i) => ({
        text: label,
        fillStyle: (ds.backgroundColor as string[])[i],
        strokeStyle: ds.borderColor as string,
        lineWidth: 1,
        hidden: false,
        index: 0
      }));
    }

    if (this.chartType === 'pie' || this.chartType === 'doughnut') {
      const ds = chart.data.datasets[0];
      const labels = chart.data.labels as string[];
      return labels.map((label, i) => ({
        text: label,
        fillStyle: (ds.backgroundColor as string[])[i],
        strokeStyle: '#000',
        lineWidth: 1,
        hidden: false,
        index: i
      }));
    }

    return Chart.defaults.plugins.legend.labels.generateLabels(chart);
  }

  private getBackgroundColors(length: number): string[] {
    const colors = [
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 99, 132, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(199, 199, 199, 0.6)',
      'rgba(255, 99, 255, 0.6)'
    ];
    return Array.from({ length }, (_, i) => colors[i % colors.length]);
  }
}

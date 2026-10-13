import { Component, ChangeDetectorRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { BigSwitchComponent } from "../../../../shared/big-switch/big-switch.component";
import { ChartItem } from '../../../../interfaces/stats/chart-item.interface';
import { MaterialUsageItem } from '../../../../interfaces/stats/material-usage-item.interface';
import { GemCutUsageItem } from '../../../../interfaces/stats/gem-cut-usage-item.interface';
import { MetalGemCombinationItem } from '../../../../interfaces/stats/metal-gem-combination-item.interface';
import { GemName } from '../../../../interfaces/stats/gem-name.interface';
import { CutName } from '../../../../interfaces/stats/cut-name.interface';
import { MaterialName } from '../../../../interfaces/stats/material-name.interface';
import { NgxEchartsModule } from 'ngx-echarts';
import { GoUpButtonComponent } from '../go-up-button/go-up-button.component';
import { StatsAdminService } from '../../../../services/stats-admin.service';

import * as echarts from 'echarts';

@Component({
  selector: 'app-gemas-metales',
  imports: [BigSwitchComponent, NgxEchartsModule, NgClass, GoUpButtonComponent],
  templateUrl: './gemas-metales.component.html',
  styleUrl: './gemas-metales.component.scss'
})
export class GemasMetalesComponent {
  constructor(private statsAdminService: StatsAdminService, private cdr: ChangeDetectorRef) {}

  view = false;
  xAxis = false;

  // Datos
  budgetDist = {
    designed: {
      budgetDist: [] as ChartItem[]
    },
    bought: {
      budgetDist: [] as ChartItem[]
    }
  };

  // Opciones chart distribucion del presupuesto
  option: any = {
    grid: {
      left: 0,
      right: 20,
      top: 20,
      bottom: 0,
      containLabel: false
    },
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
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    series: [
      {
        type: 'bar',
        barWidth: '90%',
        data: [],
        animation: true,
        animationDuration: 1200,
        animationEasing: 'cubicOut',
        animationDurationUpdate: 1200,
        animationEasingUpdate: 'cubicOut',
        animationDelay: (idx: number) => idx * 150,
        itemStyle: {
          color: (params: any) => {
            const gradients = [
              new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#FBFFDB' },
                { offset: 1, color: '#E9EB4E' }
              ]),
              new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#FBDBFF' },
                { offset: 1, color: '#CD8ED6' }
              ]),
              new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#e6a8ef' },
                { offset: 1, color: '#f4d2f8' }
              ])
            ];
            return gradients[params.dataIndex % gradients.length];
          }
        },
        label: {
          show: true,
          position: 'outside',
          align: 'right',
          verticalAlign: 'middle',
          formatter: (params: any) => {
            return `{percent|${params.value}%}\n{name|${params.name}}`;
          },
          rich: {
            percent: {
              fontSize: 64,
              fontWeight: 'bold',
              color: '#562172',
              padding: [0, 18, 0, 0]
            },
            name: {
              fontSize: 20,
              fontWeight: 'bold',
              color: '#562172',
              padding: [0, 18, 0, 0]
            }
          }
        }
      }
    ]
  };

  // METALES USADOS
  materialUsage = {
    designed: [] as MaterialUsageItem[],
    bought: [] as MaterialUsageItem[]
  };

  materialUseOption: any = {
    animation: true,
    animationDuration: 1400,
    animationEasing: 'cubicOut',
    animationDurationUpdate: 1000,
    animationEasingUpdate: 'cubicOut',
    grid: {
      left: 20,
      right: 20,
      top: 15,
      bottom: 0,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: [],
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#562172',
        fontSize: 16,
        fontWeight: 'bold',
        margin: 16
      }
    },
    yAxis: {
      type: 'value',
      show: false
    },
    legend: {
      show: false
    },
    series: []
  };

  // GEMAS Y CORTES USADOS
  gemCutUsage = {
    designed: [] as GemCutUsageItem[],
    bought: [] as GemCutUsageItem[]
  };

  gemCutOption: any = {
    animation: true,
    animationDuration: 1400,
    animationEasing: 'cubicOut',
    animationDurationUpdate: 1000,
    animationEasingUpdate: 'cubicOut',
    grid: {
      left: 20,
      right: 20,
      top: 90,
      bottom: 10,
      containLabel: true
    },
    legend: {
      show: true,
      top: 20,
      left: 'center',
      orient: 'horizontal',
      itemWidth: 14,
      itemHeight: 14,
      textStyle: {
        color: '#562172',
        fontSize: 13,
        fontWeight: 'bold'
      }
    },
    xAxis: {
      type: 'category',
      data: [],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        interval: 0,
        margin: 28,
        color: '#562172',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: []
  };

  // COMBINACIONES METAL Y GEMAS
  metalGemCombinations = {
    designed: [] as MetalGemCombinationItem[],
    bought: [] as MetalGemCombinationItem[]
  };

  ngOnInit(): void {
    this.loadBudgetDistributionFromBackend();
    this.loadMaterialUsageFromBackend();
    this.loadGemCutUsageFromBackend();
    this.loadMetalGemCombinationsFromBackend();
  }

  loadBudgetDistributionFromBackend(): void {
    this.statsAdminService.getBudgetDistribution().subscribe({
      next: (data) => {
        this.budgetDist = data.budgetDistribution;

        const chartData = this.view
          ? this.budgetDist.bought.budgetDist
          : this.budgetDist.designed.budgetDist;

        this.updateChart(chartData);
        this.cdr.detectChanges();
      },
      error: (error) => {
      }
    });
  }

  loadBudgetChart(): void {
    const data = this.view
      ? this.budgetDist.bought.budgetDist
      : this.budgetDist.designed.budgetDist;

    this.updateChart(data);
  }

  loadMaterialUsageFromBackend(): void {
    this.statsAdminService.getMaterialUsage().subscribe({
      next: (data) => {
        this.materialUsage = data.materialUsage;
        this.loadMaterialUseChart();
        this.cdr.detectChanges();
      },
      error: (error) => {}
    });
  }

  loadMaterialUseChart(): void {
    const data = this.view
      ? this.materialUsage.bought
      : this.materialUsage.designed;
    
    this.updateMaterialUseChart(data);
  }

  loadGemCutUsageFromBackend(): void {
    this.statsAdminService.getGemCutUsage().subscribe({
      next: (data) => {
        this.gemCutUsage = data.gemCutUsage;
        this.loadGemCutChart();
        this.cdr.detectChanges();
      },
      error: (error) => {}
    });
  }

  loadGemCutChart(): void {
    const data = this.view
      ? this.gemCutUsage.bought
      : this.gemCutUsage.designed;

    this.updateGemCutChart(data, !this.xAxis);
  }

  loadMetalGemCombinationsFromBackend(): void {
    this.statsAdminService.getMetalGemCombinations().subscribe({
      next: (data) => {
        this.metalGemCombinations = data.metalGemCombinations;
        this.cdr.detectChanges();
      },
      error: (error) => {}
    });
  }

  get currentMetalGemCombinations(): MetalGemCombinationItem[] {
    return this.view
      ? this.metalGemCombinations.bought
      : this.metalGemCombinations.designed;
  }

  // DISTRIBUCION PRESUPUESTO
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
          name: d.name,
          label: d.percentage < 40
            ? {
                show: true,
                position: 'right',
                align: 'left',
                verticalAlign: 'middle',
                distance: 16,
                formatter: `{percent|${d.percentage}%}\n{name|${d.name}}`
              }
            : {
                show: true,
                position: 'insideRight',
                align: 'right',
                verticalAlign: 'middle',
                formatter: `{percent|${d.percentage}%}\n{name|${d.name}}`
              }
          }))
        }
      ]
    };

  }

  // METALES USADOS
  getMaterialColor(material: MaterialName, purity: '9K' | '14K' | '18K' | 'Pt950'): string {
    const colorMap: Record<MaterialName, Record<string, string>> = {
        'Oro amarillo': {
          '9K': '#F8EFC9',
          '14K': '#F2DB6D',
          '18K': '#F0C808'
        },
        'Oro rosa': {
          '9K': '#EFD2D2',
          '14K': '#E2B1B1',
          '18K': '#D29595'
        },
        'Oro blanco': {
          '9K': '#CFE1F6',
          '14K': '#8EBBEA',
          '18K': '#5A9BE0'
        },
        'Platino': {
          'Pt950': '#B5B5B5'
        }
      };

    return colorMap[material][purity];
  }

  getMaterialBorderColor(material: MaterialName, purity: '9K' | '14K' | '18K' | 'Pt950'): string {
    const borderMap: Record<MaterialName, Record<string, string>> = {
      'Oro amarillo': {
        '9K': '#E1BA17',
        '14K': '#E1BA17',
        '18K': '#E1BA17',
        'Pt950': '#E1BA17'
      },
      'Oro rosa': {
        '9K': '#D89F9F',
        '14K': '#D89F9F',
        '18K': '#D89F9F',
        'Pt950': '#D89F9F'
      },
      'Oro blanco': {
        '9K': '#5B94D4',
        '14K': '#5B94D4',
        '18K': '#5B94D4',
        'Pt950': '#5B94D4'
      },
      'Platino': {
        '9K': '#AAAAAA',
        '14K': '#AAAAAA',
        '18K': '#AAAAAA',
        'Pt950': '#AAAAAA'
      }
  };

  return borderMap[material][purity];
  }

  updateMaterialUseChart(data: MaterialUsageItem[]): void {
    const grandTotal = data.reduce((sum, item) => {
      return sum + (item.k9 ?? 0) + (item.k14 ?? 0) + (item.k18 ?? 0) + (item.pt950 ?? 0);
    }, 0);

    const normalized = data.map(item => {
      const rawSegments = [
        { purity: '9K', value: item.k9 ?? 0 },
        { purity: '14K', value: item.k14 ?? 0 },
        { purity: '18K', value: item.k18 ?? 0 },
        { purity: 'Pt950', value: item.pt950 ?? 0 }
      ].filter(segment => segment.value > 0);

      const total = rawSegments.reduce((sum, segment) => sum + segment.value, 0);

      const segments = rawSegments
        .map(segment => ({
          ...segment,
          percentWithinMaterial: total > 0 ? (segment.value / total) * 100 : 0,
          percentWithinAllMaterials: grandTotal > 0 ? (segment.value / grandTotal) * 100 : 0
        }))
        .sort((a, b) => b.value - a.value);

      return {
        material: item.material,
        segments,
        total,
        percentOfTotal: grandTotal > 0 ? (total / grandTotal) * 100 : 0
      };
    });

    const sortedMaterials = [...normalized].sort((a, b) => b.total - a.total);
    const categories = sortedMaterials.map(item => item.material);

    const maxSegments = Math.max(...sortedMaterials.map(item => item.segments.length), 0);

    const series = Array.from({ length: maxSegments }, (_, segmentIndex) => {
      return {
        name: `stack_${segmentIndex}`,
        type: 'bar',
        stack: 'total',
        barWidth: '88%',
        animation: true,
        animationDuration: 1200,
        animationEasing: 'cubicOut',
        animationDurationUpdate: 1200,
        animationEasingUpdate: 'cubicOut',
        animationDelay: (idx: number) => idx * 120 + segmentIndex * 180,
        label: {
          show: false
        },
        emphasis: {
          disabled: false
        },
        data: sortedMaterials.map(item => {
          const segment = item.segments[segmentIndex];

          if (!segment) {
            return {
              value: 0,
              itemStyle: {
                color: 'transparent',
                borderColor: 'transparent'
              }
            };
          }

          const purity = segment.purity as '9K' | '14K' | '18K' | 'Pt950';

          return {
            value: segment.value,
            purity,
            material: item.material,
            totalMaterial: item.total,
            percentWithinMaterial: segment.percentWithinMaterial,
            percentWithinAllMaterials: segment.percentWithinAllMaterials,
            itemStyle: {
              color: this.getMaterialColor(item.material, purity),
              borderColor: this.getMaterialBorderColor(item.material, purity),
              borderWidth: 1
            }
          };
        })
      };
    });

    this.materialUseOption = {
      ...this.materialUseOption,
      tooltip: {
        trigger: 'item',
        backgroundColor: '#FFFFFF',
        borderColor: '#562172',
        borderWidth: 1,
        textStyle: {
          color: '#562172',
          fontSize: 14
        },
        formatter: (params: any) => {
          const data = params.data;

          if (!data || !data.value) {
            return '';
          }

          return `
            <div style="font-weight:700; margin-bottom:6px;">
              ${data.material} ${data.purity}
            </div>
            <div>Dentro de ${data.material}: <b>${data.percentWithinMaterial.toFixed(1)}%</b></div>
            <div>Sobre el total global: <b>${data.percentWithinAllMaterials.toFixed(1)}%</b></div>
            <p style="font-size:12px; opacity:.8; color:black">Utilizado en ${data.value} de ${data.totalMaterial} anillos.</p>
          `;
        }
      },
      grid: {
        left: 20,
        right: 20,
        top: 25,
        bottom: 0,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          interval: 0,
          margin: 28,
          formatter: (value: string) => {
            const item = sortedMaterials.find(material => material.material === value);

            if (!item) {
              return value;
            }

            return `{name|${item.material}}\n{percent|${Math.round(item.percentOfTotal)}%}`;
          },
          rich: {
            name: {
              color: '#562172',
              fontSize: 16,
              fontWeight: 'bold',
              lineHeight: 24,
              align: 'center'
            },
            percent: {
              color: '#562172',
              fontSize: 18,
              fontWeight: 'bold',
              lineHeight: 30,
              align: 'center'
            }
          }
        }
      },
      yAxis: {
        type: 'value',
        show: false
      },
      series,
      graphic: []
    };
  }

  // GEMAS Y CORTES USADOS 
  getGemColor(gem: GemName): string {
    const colors: Record<GemName, string> = {
      'Diamante': '#F2D95C',
      'Rubí': '#D94B70',
      'Esmeralda': '#2DBE7F',
      'Zafiro': '#4B7BE5',
      'Amatista': '#A56BEA',
      'Turmalina': '#F28AAE',
      'Aguamarina': '#69CFE8'
    };

    return colors[gem];
  }

  getCutColor(cut: CutName): string {
    const colors: Record<CutName, string> = {
      'Brillante': '#F2D95C',
      'Oval clásico': '#F3A261',
      'Oval East-West': '#E76F51',
      'Princesa': '#7E57C2',
      'Marquesa': '#D94B70',
      'Pera': '#43AA8B',
      'Esmeralda': '#4D96FF'
    };

    return colors[cut];
  }

  getGemBorderColor(gem: GemName): string {
    const colors: Record<GemName, string> = {
      'Diamante': '#D6BF49',
      'Rubí': '#B93255',
      'Esmeralda': '#249967',
      'Zafiro': '#2F5FCC',
      'Amatista': '#7F48C7',
      'Turmalina': '#D96C92',
      'Aguamarina': '#43B8D4'
    };

    return colors[gem];
  }

  getCutBorderColor(cut: CutName): string {
    const colors: Record<CutName, string> = {
      'Brillante': '#D6BF49',
      'Oval clásico': '#D78549',
      'Oval East-West': '#C7583E',
      'Princesa': '#6543A9',
      'Marquesa': '#B93255',
      'Pera': '#348A71',
      'Esmeralda': '#3979D6'
    };

    return colors[cut];
  }

  updateGemCutChart(data: GemCutUsageItem[], gemsOnXAxis: boolean): void {
    const xKey = gemsOnXAxis ? 'gem' : 'cut';
    const stackKey = gemsOnXAxis ? 'cut' : 'gem';

    const grandTotal = data.reduce((sum, item) => sum + item.value, 0);

    const groupedMap = new Map<string, { xName: string; segments: { name: string; value: number }[]; total: number }>();

    for (const item of data) {
      const xName = item[xKey] as string;
      const segmentName = item[stackKey] as string;

      if (!groupedMap.has(xName)) {
        groupedMap.set(xName, {
          xName,
          segments: [],
          total: 0
        });
      }

      const group = groupedMap.get(xName)!;
      group.segments.push({
        name: segmentName,
        value: item.value
      });
      group.total += item.value;
    }

    const normalized = Array.from(groupedMap.values()).map(group => ({
      ...group,
      percentOfTotal: grandTotal > 0 ? (group.total / grandTotal) * 100 : 0,
      segments: group.segments
        .map(segment => ({
          ...segment,
          percentWithinBar: group.total > 0 ? (segment.value / group.total) * 100 : 0,
          percentWithinAll: grandTotal > 0 ? (segment.value / grandTotal) * 100 : 0
        }))
        .sort((a, b) => b.value - a.value)
    }));

    const sortedBars = [...normalized].sort((a, b) => b.total - a.total);
    const categories = sortedBars.map(item => item.xName);
    const maxSegments = Math.max(...sortedBars.map(item => item.segments.length), 0);

    const legendItems = gemsOnXAxis
      ? ['Brillante', 'Oval clásico', 'Oval East-West', 'Princesa', 'Marquesa', 'Pera', 'Esmeralda']
      : ['Diamante', 'Rubí', 'Esmeralda', 'Zafiro', 'Amatista', 'Turmalina', 'Aguamarina'];

    const series = Array.from({ length: maxSegments }, (_, segmentIndex) => {
      return {
        name: `stack_${segmentIndex}`,
        type: 'bar',
        stack: 'total',
        barWidth: '88%',
        animation: true,
        animationDuration: 1400,
        animationEasing: 'cubicOut',
        animationDurationUpdate: 1000,
        animationEasingUpdate: 'cubicOut',
        animationDelay: (idx: number) => idx * 120 + segmentIndex * 150,
        animationDelayUpdate: (idx: number) => idx * 40,
        label: {
          show: false
        },
        emphasis: {
          disabled: false
        },
        data: sortedBars.map(bar => {
          const segment = bar.segments[segmentIndex];

          if (!segment) {
            return {
              value: 0,
              itemStyle: {
                color: 'transparent',
                borderColor: 'transparent'
              }
            };
          }

          const fillColor = gemsOnXAxis
            ? this.getCutColor(segment.name as CutName)
            : this.getGemColor(segment.name as GemName);

          const borderColor = gemsOnXAxis
            ? this.getCutBorderColor(segment.name as CutName)
            : this.getGemBorderColor(segment.name as GemName);

          return {
            value: segment.value,
            xName: bar.xName,
            segmentName: segment.name,
            totalBar: bar.total,
            percentWithinBar: segment.percentWithinBar,
            percentWithinAll: segment.percentWithinAll,
            itemStyle: {
              color: fillColor,
              borderColor,
              borderWidth: 1
            }
          };
        })
      };
    });

    const legendSeries = legendItems.map((item) => ({
      name: item,
      type: 'bar',
      data: [],
      itemStyle: {
        color: gemsOnXAxis
          ? this.getCutColor(item as CutName)
          : this.getGemColor(item as GemName),
        borderColor: gemsOnXAxis
          ? this.getCutBorderColor(item as CutName)
          : this.getGemBorderColor(item as GemName),
        borderWidth: 1
      }
    }));

    this.gemCutOption = {
      animation: true,
      animationDuration: 1400,
      animationEasing: 'cubicOut',
      animationDurationUpdate: 1000,
      animationEasingUpdate: 'cubicOut',

      legend: {
        show: true,
        top: 70,
        left: 'right',
        orient: 'vertical',
        data: legendItems,
        itemWidth: 28,
        itemHeight: 14,
        selectedMode: false,
        textStyle: {
          color: '#562172',
          fontSize: 13,
          fontWeight: 'bold'
        }
      },

      tooltip: {
        trigger: 'item',
        backgroundColor: '#FFFFFF',
        borderColor: '#562172',
        borderWidth: 1,
        textStyle: {
          color: '#562172',
          fontSize: 14
        },
        formatter: (params: any) => {
          const d = params.data;

          if (!d || !d.value) {
            return '';
          }

          return `
            <div style="font-weight:700; margin-bottom:6px;">
              ${d.segmentName}
            </div>
            <div>Dentro de ${d.xName}: <b>${d.percentWithinBar.toFixed(1)}%</b></div>
            <div>Sobre el total global: <b>${d.percentWithinAll.toFixed(1)}%</b></div>
            <p style="font-size:12px; opacity:.8; color:black">
              Utilizado en ${d.value} de ${d.totalBar} anillos.
            </p>
          `;
        }
      },

      grid: {
        left: 20,
        right: 150,
        top: 10,
        bottom: 20,
        containLabel: true
      },

      xAxis: {
        type: 'category',
        data: categories,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          interval: 0,
          margin: 28,
          formatter: (value: string) => {
            const item = sortedBars.find(bar => bar.xName === value);

            if (!item) {
              return value;
            }

            return `{name|${item.xName}}\n{percent|${Math.round(item.percentOfTotal)}%}`;
          },
          rich: {
            name: {
              color: '#562172',
              fontSize: 16,
              fontWeight: 'bold',
              lineHeight: 24,
              align: 'center'
            },
            percent: {
              color: '#562172',
              fontSize: 18,
              fontWeight: 'bold',
              lineHeight: 30,
              align: 'center'
            }
          }
        }
      },

      yAxis: {
        type: 'value',
        show: false
      },

      series: [...series, ...legendSeries]
    };
  }

  swapView(value: boolean) {
    this.view = value;
    this.loadBudgetChart();
    this.loadMaterialUseChart();
    this.loadGemCutChart();
  }

  swapX(value: boolean) {
    this.xAxis = value;
    this.loadGemCutChart();
  }
}

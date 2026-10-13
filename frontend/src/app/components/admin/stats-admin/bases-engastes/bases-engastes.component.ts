import { Component, ChangeDetectorRef } from '@angular/core';
import { BigSwitchComponent } from "../../../../shared/big-switch/big-switch.component";
import { GoUpButtonComponent } from '../go-up-button/go-up-button.component';
import { UsageItem } from '../../../../interfaces/stats/usage-item.interface';
import { NgxEchartsModule } from 'ngx-echarts';
import { StatsAdminService } from '../../../../services/stats-admin.service';
import { BaseSettingCombination } from '../../../../interfaces/stats/base-setting-combitantion-item.interface';
import { DonutItem } from '../../../../interfaces/stats/donut-item.interface';
import { BaseUsageItem } from '../../../../interfaces/stats/base-usage-item.interface';

@Component({
  selector: 'app-bases-engastes',
  imports: [BigSwitchComponent, NgxEchartsModule, GoUpButtonComponent],
  templateUrl: './bases-engastes.component.html',
  styleUrl: './bases-engastes.component.scss'
})
export class BasesEngastesComponent {
  constructor(private statsAdminService: StatsAdminService, private cdr: ChangeDetectorRef) {}

  view = false;

  selectedBase: BaseUsageItem | null = null;
  selectedProfileItem: DonutItem | null = null;
  selectedStyleItem: DonutItem | null = null;

  // Datos temporales
  // Uso de engastes
  settingUsage = {
    designed: [] as UsageItem[],
    bought: [] as UsageItem[]
  };

  settingUseOption: any = {};

  // Uso tallas
  sizeUsage = {
    designed: [] as UsageItem[],
    bought: [] as UsageItem[]
  };

  sizeUseOption: any = {};

  // Combinaciones base y engaste
  baseSettingCombinations = {
    designed: [] as BaseSettingCombination[],
    bought: [] as BaseSettingCombination[]
  };

  // Uso bases
  baseUsage = {
    designed: [] as BaseUsageItem[],
    bought: [] as BaseUsageItem[]
  };

  baseUseOption: any = {};
  profileDonutOption: any = {};
  styleDonutOption: any = {};

  ngOnInit(): void {
    this.loadSettingUsageFromBackend();
    this.loadSizeUsageFromBackend();
    this.loadBaseSettingCombinationsFromBackend();
    this.loadBaseUsageFromBackend();
  }

  loadSettingUsageFromBackend(): void {
    this.statsAdminService.getSettingUsage().subscribe({
      next: (data) => {
        this.settingUsage = data.settingUsage;
        this.loadSettingUseChart();
        this.cdr.detectChanges();
      },
      error: (error) => {
      }
    });
  }

  loadSettingUseChart(): void {
    const data = this.view
      ? this.settingUsage.bought
      : this.settingUsage.designed;

    this.updateSettingUseChart(data);
  }

  loadSizeUsageFromBackend(): void {
    this.statsAdminService.getSizeUsage().subscribe({
      next: (data) => {
        this.sizeUsage = data.sizeUsage;
        this.loadSizeUseChart();
        this.cdr.detectChanges();
      },
      error: (error) => {}
    });
  }

  loadSizeUseChart(): void {
    const data = this.view
      ? this.sizeUsage.bought
      : this.sizeUsage.designed;

    this.updateSizeUseChart(data);
  }

  loadBaseUsageFromBackend(): void {
    this.statsAdminService.getBaseUsage().subscribe({
      next: (data) => {
        this.baseUsage = data.baseUsage;
        this.loadBaseUseCharts();
        this.cdr.detectChanges();
      },
      error: (error) => {
      }
    });
  }

  loadBaseUseCharts(): void {
    const data = this.view
      ? this.baseUsage.bought
      : this.baseUsage.designed;

    this.selectedBase = data[0] ?? null;

    this.updateBaseUseChart(data);
    this.updateDetailDonuts();
  }

  updateSettingUseChart(data: UsageItem[]): void {
    const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

    this.settingUseOption = {
      animation: true,
      animationDuration: 1200,
      animationEasing: 'cubicOut',
      animationDurationUpdate: 1000,
      animationEasingUpdate: 'cubicOut',

      grid: {
        left: 40,
        right: 40,
        top: 80,
        bottom: 45,
        containLabel: true
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

          return `
            <div style="font-weight:700; margin-bottom:6px;">
              ${d.name}
            </div>
            <div>Usado en el <b>${d.value}%</b> de los anillos</div>
            <div>Usado en <b>${d.quantity}</b> anillos</div>
          `;
        }
      },

      xAxis: {
        type: 'category',
        data: sortedData.map(item => item.name),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          interval: 0,
          color: '#562172',
          fontSize: 14,
          fontWeight: 'normal',
          margin: 14,
          lineHeight: 18
        },
      },

      yAxis: {
        type: 'value',
        show: false,
        max: 35
      },

      series: [
        {
          type: 'bar',
          barWidth: '70%',
          barCategoryGap: '6%',
          data: sortedData.map(item => ({
            value: item.percentage,
            name: item.name,
            quantity: item.quantity
          })),
          itemStyle: {
            color: '#DDA2E8'
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            color: '#562172',
            fontSize: 18,
            fontWeight: 'bold'
          }
        }
      ]
    };
  }

  updateSizeUseChart(data: UsageItem[]): void {
    const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

    this.sizeUseOption = {
      animation: true,
      animationDuration: 1800,
      animationEasing: 'quarticOut',
      animationDurationUpdate: 1200,
      animationEasingUpdate: 'quarticOut',

      grid: {
        left: 35,
        right: 35,
        top: 70,
        bottom: 35,
        containLabel: true
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

          return `
            <div style="font-weight:700; margin-bottom:6px;">
              Talla ${d.name}
            </div>
            <div>Usado en el <b>${d.value}%</b> de los anillos</div>
            <div>Usado en <b>${d.quantity}</b> anillos</div>
          `;
        }
      },

      xAxis: {
        type: 'category',
        data: sortedData.map(item => item.name),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          interval: 0,
          color: '#562172',
          fontSize: 18,
          fontWeight: 'normal',
          margin: 14
        }
      },

      yAxis: {
        type: 'value',
        show: false,
        max: 35
      },

      series: [
        {
          type: 'bar',
          barWidth: '90%',
          animationDelay: (idx: number) => idx * 100,
          animationDelayUpdate: (idx: number) => idx * 60,
          data: sortedData.map(item => ({
            value: item.percentage,
            name: item.name,
            quantity: item.quantity
          })),
          itemStyle: {
            color: '#DDA2E8'
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            color: '#562172',
            fontSize: 18,
            fontWeight: 'bold'
          }
        }
      ]
    };
  }

  loadBaseSettingCombinationsFromBackend(): void {
    this.statsAdminService.getBaseSettingCombinations().subscribe({
      next: (data) => {
        this.baseSettingCombinations = data.baseSettingCombinations;
        this.cdr.detectChanges();
      },
      error: (error) => {}
    });
  }

  get currentBaseSettingCombinations(): BaseSettingCombination[] {
    return this.view
      ? this.baseSettingCombinations.bought
      : this.baseSettingCombinations.designed;
  }

  updateBaseUseChart(data: BaseUsageItem[]): void {
    const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

    this.baseUseOption = {
      animation: true,
      animationDuration: 1400,
      animationEasing: 'quarticOut',

      grid: {
        left: 90,
        right: 40,
        top: 60,
        bottom: 40,
        containLabel: true
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

          return `
            <div style="font-weight:700; margin-bottom:6px;">${d.name}</div>
            <div>Usada en el <b>${d.value}%</b> de los anillos</div>
            <div>Usada en <b>${d.quantity}</b> anillos</div>
            <div style="font-size:12px; opacity:.75; margin-top:6px;">Click para ver detalles</div>
          `;
        }
      },

      xAxis: {
        type: 'value',
        show: false,
        max: 35
      },

      yAxis: {
        type: 'category',
        inverse: true,
        data: sortedData.map(item => item.name),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#562172',
          fontSize: 16,
          fontWeight: 'normal',
          margin: 20
        }
      },

      series: [
        {
          type: 'bar',
          barWidth: 42,
          data: sortedData.map(item => ({
            value: item.percentage,
            name: item.name,
            quantity: item.quantity,
            fullItem: item,
            itemStyle: {
              color: this.selectedBase?.name === item.name ? '#D681E4' : '#DDA2E8',
              borderColor: this.selectedBase?.name === item.name ? '#562172' : 'transparent',
              borderWidth: this.selectedBase?.name === item.name ? 2 : 0
            }
          })),
          label: {
            show: true,
            position: 'insideRight',
            formatter: '{c}%',
            color: '#562172',
            fontSize: 18,
            fontWeight: 'bold'
          }
        }
      ]
    };
  }

  onBaseClick(event: any): void {
    if (!event?.data?.fullItem) return;

    this.selectedBase = event.data.fullItem;

    const data = this.view
      ? this.baseUsage.bought
      : this.baseUsage.designed;

    this.updateBaseUseChart(data);
    this.updateDetailDonuts();
  }

  updateDetailDonuts(): void {
    if (!this.selectedBase) return;

    this.selectedProfileItem = [...this.selectedBase.profile]
      .sort((a, b) => b.percentage - a.percentage)[0] ?? null;

    this.selectedStyleItem = [...this.selectedBase.style]
      .sort((a, b) => b.percentage - a.percentage)[0] ?? null;

    this.profileDonutOption = this.buildDonutOption(this.selectedBase.profile, this.selectedProfileItem);
    this.styleDonutOption = this.buildDonutOption(this.selectedBase.style, this.selectedStyleItem);
  }

  onProfileDonutClick(event: any): void {
    this.selectedProfileItem = event.data as DonutItem;

    if (this.selectedBase) {
      this.profileDonutOption = this.buildDonutOption(this.selectedBase.profile, this.selectedProfileItem);
    }
  }

  onStyleDonutClick(event: any): void {
    this.selectedStyleItem = event.data as DonutItem;

    if (this.selectedBase) {
      this.styleDonutOption = this.buildDonutOption(this.selectedBase.style, this.selectedStyleItem);
    }
  }

  buildDonutOption(data: DonutItem[], selectedItem?: DonutItem | null): any {
    const colors = ['#4FA3F7', '#FF6868', '#22CFA0', '#B23AC7', '#F3F264'];
    const borderColors = ['#2432E8', '#D94B4B', '#159C78', '#7E2592', '#D6D843'];

    return {
      animation: true,
      animationDuration: 1000,
      animationEasing: 'quarticOut',

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

          return `
            <div style="font-weight:700; margin-bottom:6px;">${d.name}</div>
            <div>Usado en el <b>${d.value}%</b> de los anillos</div>
            <div>Usado en <b>${d.quantity}</b> anillos</div>
          `;
        }
      },

      legend: {
        orient: 'vertical',
        right: 0,
        top: 'center',
        selectedMode: false,
        icon: 'circle',
        itemWidth: 16,
        itemHeight: 16,
        textStyle: {
          color: '#562172',
          fontSize: 16
        }
      },

      series: [
        {
          type: 'pie',
          radius: ['48%', '78%'],
          center: ['38%', '50%'],
          selectedMode: 'single',
          selectedOffset: 8,
          label: { show: false },
          labelLine: { show: false },
          data: data.map((item, index) => {
            const isSelected = selectedItem?.name === item.name;

            return {
              ...item,
              value: item.percentage,
              selected: isSelected,
              itemStyle: {
                color: colors[index % colors.length],
                borderColor: isSelected ? borderColors[index % colors.length] : '#FFFFFF',
                borderWidth: isSelected ? 4 : 3
              }
            };
          })
        }
      ]
    };
  }

  swapView(value: boolean) {
    this.view = value;
    this.loadSettingUseChart();
    this.loadSizeUseChart();
    this.loadBaseUseCharts();
  }
}

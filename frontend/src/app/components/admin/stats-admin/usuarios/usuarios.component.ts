import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { StatsCard } from '../../../../interfaces/stats/stats-card.interface';
import { FunnelMetric, ComplexFunnelStep, SourceStat} from '../../../../interfaces/stats/funnel-step.interface';
import { UserStatsResponse } from '../../../../interfaces/stats/user-stats.interface';
import { NgxEchartsModule } from 'ngx-echarts';
import { faFacebook, faTiktok, faWordpress, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faShareNodes, faDiamond, faSearch, faGlobe, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { StatsCardComponent } from './stats-card/stats-card.component';
import { GoUpButtonComponent } from '../go-up-button/go-up-button.component';
import { StatsAdminService } from '../../../../services/stats-admin.service';
import { EChartsOption } from 'echarts';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-usuarios',
  imports: [NgxEchartsModule, CommonModule, StatsCardComponent, GoUpButtonComponent, FontAwesomeModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})

export class UsuariosComponent implements OnInit {
  Math = Math;

  //Cambios mes a mes 
  year = new Date().getFullYear();
  month = new Date().getMonth();
  avgDesignTimeStr: string = '0s';
  avgDesignTimeChange: number = 0;

  recurrentRate: number = 0;
  recurrentRateChange: number = 0;
  
  userCache: Record<number, any[]> = {};
  
  sourcesStats: SourceStat[] = [];
  complexFunnel: ComplexFunnelStep[] = [];

  //Datos totales
  totalUsuarios: number = 0;
  ciudades: string[] = [];
  porcentajeDesconocido: string = '0%';
  chartOption: EChartsOption = {};
  chartOption2: EChartsOption = {};
  option: EChartsOption = {};
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;  

  constructor(
    private statsService: StatsAdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initData();
    this.loadStats();
    this.initFunnelChart();
  }

  initData() {
    this.loadYearData(this.year);
    this.loadYearData(this.year - 1);
  }

  initFunnelChart() {
    const opacities = [0.25, 0.21, 0.17, 0.13, 0.09, 0.06, 0.03];
    const baseColor = '#a12fb8';

    this.option = {
      backgroundColor: 'transparent',
      tooltip: { show: false }, 
      series: [
        {
          name: 'Funnel',
          type: 'funnel',
          left: '1%',
          top: 0,
          bottom: 0,
          width: '98%',
          min: 0,
          max: 100,
          minSize: '30%',
          maxSize: '100%',
          sort: 'descending',
          gap: 2,
          label: { show: false },
          labelLine: { show: false },
          emphasis: {
            label: { show: false }
          },
          itemStyle: {
            borderWidth: 0
          },
          data: [
            { value: 100, itemStyle: { color: baseColor, opacity: opacities[0] } },
            { value: 85,  itemStyle: { color: baseColor, opacity: opacities[1] } },
            { value: 70,  itemStyle: { color: baseColor, opacity: opacities[2] } },
            { value: 55,  itemStyle: { color: baseColor, opacity: opacities[3] } },
            { value: 40,  itemStyle: { color: baseColor, opacity: opacities[4] } },
            { value: 25,  itemStyle: { color: baseColor, opacity: opacities[5] } },
            { value: 10,  itemStyle: { color: baseColor, opacity: opacities[6] } }
          ]
        }
      ]
    };
  }

  loadYearData(year: number) {
    this.statsService.getUserFullStats(year).subscribe({
      next: (res) => {
        this.userCache[year] = res.data;
        this.updateUI();
      }
    });
  }

  updateUI() {
    const currentYearData = this.userCache[this.year] || [];
    const prevYearData = this.userCache[this.year - 1] || [];

    const curM = currentYearData[this.month] || this.getEmptyMonth();

    let prevM = (this.month === 0) ? (prevYearData[11] || this.getEmptyMonth()) : (currentYearData[this.month - 1] || this.getEmptyMonth());

    const calcChange = (curr: number, prev: number) => {
      if (!prev || prev === 0) return curr > 0 ? 100 : 0;
      return parseFloat((((curr - prev) / prev) * 100).toFixed(1));
    };

    const totalVisits = curM.visits || 1; 
    const src = curM.sources;
    const prevSrc = prevM.sources;
    const prevVisits = prevM.visits || 1;

    const sourceConfigs = [
      { key: 'google', title: 'Google', icon: faSearch },
      { key: 'instagram', title: 'Instagram', icon: faInstagram },
      { key: 'tiktok', title: 'TikTok', icon: faTiktok },
      { key: 'facebook', title: 'Facebook', icon: faFacebook },
      { key: 'wordpress', title: 'Wordpress', icon: faWordpress },
      { key: 'direct', title: 'Directo', icon: faGlobe }
    ];

    this.sourcesStats = sourceConfigs.map(s => ({
      title: s.title,
      visits: src[s.key],
      percentage: parseFloat(((src[s.key] / totalVisits) * 100).toFixed(1)),
      change: calcChange(src[s.key], prevSrc[s.key]),
      icon: s.icon
    }));

    const calcRate = (value: number, total: number) => total > 0 ? parseFloat(((value / total) * 100).toFixed(1)) : 0;

    const bounceRate = (100 - calcRate(curM.activeUsers, totalVisits)).toFixed(2);
    const prevBounce = 100 - calcRate(prevM.activeUsers, prevVisits);

    const hasVisits = curM.visits > 0;
    const loginRate = hasVisits ? calcRate(curM.logins, totalVisits) : 0;
    const signupRate = hasVisits ? calcRate(curM.signups, totalVisits) : 0;
    // Si no hay visitas, visitorRate debe ser 0, NO 100
    const visitorRate = hasVisits 
        ? Math.max(0, 100 - loginRate - signupRate) 
        : 0;

    // 2. Calculamos las tasas previas solo si hubo visitas previas
    const hasPrevVisits = prevM.visits > 0;
    const pLoginRate = hasPrevVisits ? calcRate(prevM.logins, prevVisits) : 0;
    const pSignupRate = hasPrevVisits ? calcRate(prevM.signups, prevVisits) : 0;
    // Si no hubo visitas el mes pasado, la tasa previa es 0
    const pVisitorRate = hasPrevVisits 
        ? Math.max(0, 100 - pLoginRate - pSignupRate) 
        : 0;

    const edRate = calcRate(curM.editorAccesses, totalVisits);
    const pEdRate = calcRate(prevM.editorAccesses, prevVisits);

    const designRate = calcRate(curM.finishedDesigns, totalVisits);
    const pDesignRate = calcRate(prevM.finishedDesigns, prevVisits);

    const buyRate = calcRate(curM.totalBuyers, totalVisits);
    const pBuyRate = calcRate(prevM.totalBuyers, prevVisits);

    const recRate = curM.totalBuyers > 0 ? calcRate(curM.totalRecurrent, curM.totalBuyers) : 0;
    const pRecRate = prevM.totalBuyers > 0 ? calcRate(prevM.totalRecurrent, prevM.totalBuyers) : 0;

    this.complexFunnel = [
      { 
        metrics: [{ 
          label: 'Visitas', 
          value: `${curM.visits}`, 
          change: calcChange(curM.visits, prevM.visits) 
        }] 
      },
      { 
        metrics: [{ 
          label: '', 
          value: `${bounceRate}% Tasa de rebote = ${curM.activeUsers} Usuarios activos`, 
          change: calcChange(parseFloat(bounceRate), prevBounce) 
        }]
      },
      { 
        metrics: [
          { 
            label: 'Visitantes', 
            value: `${visitorRate.toFixed(2)}%`, 
            change: calcChange(visitorRate, pVisitorRate) 
          },
          { 
            label: 'Inician Sesión', 
            value: `${loginRate.toFixed(2)}%`, 
            change: calcChange(loginRate, pLoginRate) 
          },
          { 
            label: 'Se Registran', 
            value: `${signupRate.toFixed(2)}%`, 
            change: calcChange(signupRate, pSignupRate) 
          }
        ]
      },
      { 
        metrics: [{ 
          label: 'Acceden al Editor', 
          value: `${edRate.toFixed(2)}%`, 
          change: calcChange(edRate, pEdRate) 
        }] 
      },
      { 
        metrics: [{ 
          label: 'Finalizan el Diseño', 
          value: `${designRate.toFixed(2)}%`, 
          change: calcChange(designRate, pDesignRate) 
        }] 
      },
      { 
        metrics: [{ 
          label: 'Compran', 
          value: `${buyRate.toFixed(2)}%`, 
          change: calcChange(buyRate, pBuyRate) 
        }] 
      },
      { 
        metrics: [{ 
          label: 'Vuelven a comprar', 
          value: `${recRate.toFixed(2)}%`, 
          change: calcChange(recRate, pRecRate) 
        }] 
      } 
  ];
    
    const curTime = curM.avgDesignTime || 0;
    const prevTime = prevM.avgDesignTime || 0;

    this.avgDesignTimeChange = calcChange(curTime, prevTime);
    this.avgDesignTimeStr = this.formatSeconds(curTime);

    const curRetRate = totalVisits > 0 ? (curM.returningUsers / totalVisits) * 100 : 0;
    const prevRetRate = prevVisits > 0 ? (prevM.returningUsers / prevVisits) * 100 : 0;

    this.recurrentRate = parseFloat(curRetRate.toFixed(1));
    this.recurrentRateChange = calcChange(curRetRate, prevRetRate);

    this.cdr.detectChanges();
  }

  getEmptyMonth() {
    return { visits: 0, activeUsers: 0, logins: 0, signups: 0, editorAccesses: 0, finishedDesigns: 0, totalBuyers: 0, totalRecurrent: 0, sources: { google: 0, instagram: 0, tiktok: 0, facebook: 0, wordpress: 0, direct: 0 } };
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

  esFuturo(): boolean {
    const hoy = new Date();
    return this.year > hoy.getFullYear() || 
          (this.year === hoy.getFullYear() && this.month >= hoy.getMonth());
  }
  
  getMonthName = () => ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][this.month];

  formatSeconds(totalSeconds: number): string {
      if (!totalSeconds || totalSeconds === 0) return '0s';
      const mins = Math.floor(totalSeconds / 60);
      const secs = Math.round(totalSeconds % 60);
      return mins > 0 ? `${mins} min ${secs} s` : `${secs} s`;
  }

  //Sección usuarios registrados + ciudades + sexo
  loadStats() {
      this.statsService.getUserStats().subscribe({
        next: (response) => {
          const data = response.data;
          this.totalUsuarios = data.totalRegistrados;

          this.ciudades = data.provincias
            .filter(p => p._id && p._id !== 'Otras' && p._id !== 'No especificada') 
            .slice(0, 3) 
            .map(p => `${Math.round((p.total / this.totalUsuarios) * 100)}% ${p._id}`);

          const datoDesconocido = data.provincias.find(p => !p._id || p._id === 'Otras' || p._id === 'No especificada');
          if (datoDesconocido) {
            this.porcentajeDesconocido = `${Math.round((datoDesconocido.total / this.totalUsuarios) * 100)}%`;
          } else {
            this.porcentajeDesconocido = '0%';
          }

          this.chartOption = {
            grid: { left: 5, right: 5, top: 10, bottom: 10 },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderWidth: 0,
                textStyle: { color: '#333', fontSize: 12 },
                extraCssText: 'box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-radius: 4px;',
                confine: true,
                formatter: (params: any) => {
                  const p = params[0];
                  return `<div style="padding: 4px">
                            <b style="color: #6b2fb8">${p.name}</b><br/>
                            ${p.value} usuarios
                          </div>`;
                }
              },
              xAxis: { 
                type: 'category', 
                show: false, 
                data: data.evolucionMensual.map(m => `${m.month}/${m.year}`) 
              },
              yAxis: { type: 'value', show: false },
              series: [{
                data: data.evolucionMensual.map(m => m.total),
                type: 'line',
                symbol: 'circle',
                symbolSize: 4,
                showSymbol: false,
                itemStyle: { color: '#6b2fb8' },
                lineStyle: { width: 3, color: '#6b2fb8' },
                areaStyle: {
                  color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1, 
                    colorStops: [
                      { offset: 0, color: 'rgba(146, 76, 236, 0.4)' }, 
                      { offset: 1, color: 'rgba(107, 47, 184, 0)' }   
                    ]
                  },
                  opacity: 1 
                }
              }]
          };
          this.chartOption2 = {
            tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
            legend: { show: false },
            series: [{
              name: 'Usuarios',
              type: 'pie',
              radius: '70%',
              center: ['50%', '50%'],
              data: data.sexo.map(s => ({ value: s.total, name: s.etiqueta })),
              color: ['#9b30d0', '#d4a0e8', '#d4e64a'],
              label: { show: true, formatter: '{b}: {d}%', overflow: 'break', },
              labelLine: {
                length: 10,  
                length2: 10,
              },
              emphasis: {
                itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
              }
            }]
          };
          this.cdr.detectChanges();
        }
    });
  } 

}

import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

@Injectable({ providedIn: 'root' })
export class ExportService {
  
  private meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  //Función para formato números con decimales
  private formatCurrency(value: number): string {
    return (value || 0).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

// Función para cargar la imagen y convertirla a Base64 de forma asíncrona
private getBase64ImageFromURL(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    img.onerror = (error) => reject(error);
    img.src = url;
  });
}

async generatePDF(data: any, year: number) {
  const doc = new jsPDF();
  const purple: [number, number, number] = [86, 33, 114];

  // --- 1. EXTRACCIÓN DE DATOS (Mantenemos tu lógica) ---
  const facturacion = data.facturacion?.data || [];
  const uMensual = data.usuariosMensual?.data || [];
  const matD = data.materiales?.materialUsage?.designed || [];
  const matB = data.materiales?.materialUsage?.bought || [];
  const gemD = data.gemas?.gemCutUsage?.designed || [];
  const gemB = data.gemas?.gemCutUsage?.bought || [];
  const basD = data.bases?.baseUsage?.designed || [];
  const basB = data.bases?.baseUsage?.bought || [];
  const setD = data.engastes?.settingUsage?.designed || [];
  const setB = data.engastes?.settingUsage?.bought || [];

  // --- 2. PÁGINA 1: HEADER ---
  doc.setFillColor(purple[0], purple[1], purple[2]);
  doc.rect(0, 0, 210, 40, 'F');
  
  try {
    const logoUrl = 'logos/louv.png'; 
    const logoBase64 = await this.getBase64ImageFromURL(logoUrl);
    doc.addImage(logoBase64, 'PNG', 165, 14, 35, 12); 
  } catch (e) { console.log("Logo no cargado"); }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(21);
  doc.text(`INFORME DE RENDIMIENTO LOUV ${year}`, 15, 25);
  doc.setFontSize(10);
  doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 15, 32);

  // SECCIÓN 1
  doc.setTextColor(purple[0], purple[1], purple[2]);
  doc.setFontSize(16); 
  doc.text('1. Resumen Económico Mensual', 15, 50);

  autoTable(doc, {
    startY: 55,
    head: [['Mes', 'Ingresos', 'Ventas', 'P. Medio']],
    body: facturacion.map((m: any, i: number) => [
      this.meses[i], 
      `${this.formatCurrency(m.ingresosTotales)} €`, 
      m.totalProductos || 0, 
      `${this.formatCurrency(m.precioMedio)} €`
    ]),
    headStyles: { fillColor: purple }
  });

  // SECCIÓN 2
  let finalY = (doc as any).lastAutoTable.finalY;
  doc.setFontSize(16);
  doc.setTextColor(purple[0], purple[1], purple[2]);
  doc.text('2. Tráfico Web y Engagement', 15, finalY + 15);

  autoTable(doc, {
    startY: finalY + 20,
    head: [['Mes', 'Visitas', 'U. Activos', 'Recurrentes']],
    body: uMensual.map((m: any, i: number) => [
      this.meses[i],
      m.visits || 0,
      m.activeUsers || 0,
      m.returningUsers || 0,
    ]),
    headStyles: { fillColor: purple }
  });

  // --- 3. PÁGINA 2: SOURCES ---
  doc.addPage();
  doc.setFontSize(16); 
  doc.setTextColor(purple[0], purple[1], purple[2]);
  doc.text('3. Origen del Tráfico (Sources)', 15, 20);

  const sourcesTotales: any = { direct: 0, google: 0, instagram: 0, facebook: 0, tiktok: 0 };
  uMensual.forEach((m: any) => {
    if (m.sources) {
      Object.keys(sourcesTotales).forEach(k => sourcesTotales[k] += (m.sources[k] || 0));
    }
  });

  autoTable(doc, {
    startY: 25,
    head: [['Canal de Adquisición', 'Total Visitas Anuales']],
    body: Object.entries(sourcesTotales).map(([canal, total]): [string, number] => [
      canal.toUpperCase(), 
      total as number
    ]),
    headStyles: { fillColor: purple },
    theme: 'striped'
  });

  // --- 4. PÁGINA 3: METALES ---
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(purple[0], purple[1], purple[2]);
  doc.text('4. Metales: Diseñado vs. Comprado', 15, 20);
  
  doc.setFontSize(11); 
  doc.text('Distribución en el Editor (Diseñado)', 15, 28);
  autoTable(doc, {
    startY: 32,
    head: [['Metal', '9K', '14K', '18K', 'Pt950']],
    body: matD.map((m: any) => [m.material, m.k9 || 0, m.k14 || 0, m.k18 || 0, m.pt950 || 0]),
    headStyles: { fillColor: purple } 
  });

  doc.setFontSize(11);
  doc.text('Ventas Reales (Comprado)', 15, (doc as any).lastAutoTable.finalY + 12);
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 17,
    head: [['Metal', '9K', '14K', '18K', 'Pt950']],
    body: matB.map((m: any) => [m.material, m.k9 || 0, m.k14 || 0, m.k18 || 0, m.pt950 || 0]),
    headStyles: { fillColor: purple }
  });

  // --- 5. PÁGINA 4: GEMAS ---
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(purple[0], purple[1], purple[2]);
  doc.text('5. Gemas: Tendencias vs. Ventas', 15, 20);

  const todasLasGemasCortes = Array.from(new Set([
    ...gemD.map((g: any) => `${g.gem}|${g.cut}`),
    ...gemB.map((g: any) => `${g.gem}|${g.cut}`)
  ]));

  autoTable(doc, {
    startY: 28,
    head: [['Gema/Corte', 'Diseñados (Frecuencia)', 'Comprados (Ventas)']],
    body: todasLasGemasCortes.slice(0, 15).map((id: any) => {
      const [gema, corte] = id.split('|');
      
      const gd = gemD.find((g: any) => g.gem === gema && g.cut === corte);
      const gb = gemB.find((g: any) => g.gem === gema && g.cut === corte);

      return [
        `${gema} (${corte})`, 
        gd?.value || 0, 
        gb?.value || 0
      ];
    }),
    headStyles: { fillColor: purple }
  });

  // --- 6. PÁGINA 5: ESTRUCTURAS ---
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(purple[0], purple[1], purple[2]);
  doc.text('6. Estructuras y Engastes', 15, 20);

  doc.setFontSize(11);
  doc.text('Bases de Joyería', 15, 28);
  const todasLasBases = Array.from(new Set([
    ...basD.map((d: any) => d.name),
    ...basB.map((b: any) => b.name)
  ]));

  autoTable(doc, {
    startY: 32,
    head: [['Nombre Base', 'Diseños %', 'Ventas %']],
    body: todasLasBases.map((nombre: any) => {
      const bd = basD.find((d: any) => d.name === nombre);
      const bb = basB.find((b: any) => b.name === nombre);
      return [
        nombre, 
        `${this.formatCurrency(bd?.percentage)}%`, 
        `${this.formatCurrency(bb?.percentage)}%`
      ];
    }),
    headStyles: { fillColor: purple }
  });

  doc.setFontSize(11);
  doc.text('Tipos de Engaste', 15, (doc as any).lastAutoTable.finalY + 12);
  const todosLosNombres = Array.from(new Set([
    ...setD.map((s: any) => s.name),
    ...setB.map((b: any) => b.name)
  ]));

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 17,
    head: [['Engaste', 'Uso en Diseños', 'Uso en Compras']],
    body: todosLosNombres.map((nombre: any) => { // También aquí
      const diseño = setD.find((d: any) => d.name === nombre);
      const compra = setB.find((b: any) => b.name === nombre);

      return [
        nombre.replace('\n', ' '), 
        diseño?.quantity || 0, 
        compra?.quantity || 0
      ];
    }),
    headStyles: { fillColor: purple }
  });

  doc.save(`REPORTE_LOUV_${year}.pdf`);
}

//-----------  EXCEL  ---------------
// --- Función auxiliar para ajustar el ancho de columnas en Excel ---
private fitToColumn(data: any[]) {
  const columnWidths = Object.keys(data[0] || {}).map(key => {
    return { wch: Math.max(key.length, ...data.map(obj => obj[key]?.toString().length || 0)) + 2 };
  });
  return columnWidths;
}

 // --- GENERAR EXCEL (Con múltiples pestañas comparativas) ---
  generateExcel(data: any, year: number) {
    const wb = XLSX.utils.book_new();

    // 1. PESTAÑA: RESUMEN ECONÓMICO Y WEB
    const resumenMensual = data.usuariosMensual.data.map((m: any, i: number) => {
      const f = data.facturacion.data[i] || {};
      return {
        Mes: this.meses[i],
        Ingresos: this.formatCurrency(f.ingresosTotales),
        Ventas_Productos: f.totalProductos || 0,
        Precio_Medio: this.formatCurrency(f.precioMedio),
        Visitas_Web: m.visits || 0,
        Usuarios_Activos: m.activeUsers || 0,
        Usuarios_Recurrentes: m.returningUsers || 0
      };
    });
    const wsRes = XLSX.utils.json_to_sheet(resumenMensual);
    wsRes['!cols'] = this.fitToColumn(resumenMensual);
    XLSX.utils.book_append_sheet(wb, wsRes, 'Resumen_Mensual');

    // 2. PESTAÑA: METALES (Diseñado vs Comprado)
    const todosMetales = Array.from(new Set([
      ...data.materiales.materialUsage.designed.map((m: any) => m.material),
      ...data.materiales.materialUsage.bought.map((m: any) => m.material)
    ]));

    const metalesComp = todosMetales.map((nombre: any) => {
      const md = data.materiales.materialUsage.designed.find((m: any) => m.material === nombre) || {};
      const mb = data.materiales.materialUsage.bought.find((b: any) => b.material === nombre) || {};
      return {
          "Material": nombre,
          "Diseno_9K": md.k9 || 0,
          "Diseno_14": md.k14 || 0, 
          "Diseno_18K": md.k18 || 0,
          "Diseno_Pt950": md.pt950 || 0, 
          "Venta_9K": mb.k9 || 0,
          "Venta_14K": mb.k14 || 0, 
          "Venta_18K": mb.k18 || 0,
          "Venta_Pt950": mb.pt950 || 0,
      };
    });
    const wsMet = XLSX.utils.json_to_sheet(metalesComp);
    wsMet['!cols'] = this.fitToColumn(metalesComp);
    XLSX.utils.book_append_sheet(wb, wsMet, 'Metales');

    // 3. PESTAÑA: GEMAS Y CORTES
    const todasGemasClave = Array.from(new Set([
      ...data.gemas.gemCutUsage.designed.map((g: any) => `${g.gem}|${g.cut}`),
      ...data.gemas.gemCutUsage.bought.map((g: any) => `${g.gem}|${g.cut}`)
    ]));

    const gemasComp = todasGemasClave.map((id: any) => {
      const [gema, corte] = id.split('|');
      const gd = data.gemas.gemCutUsage.designed.find((g: any) => g.gem === gema && g.cut === corte) || {};
      const gb = data.gemas.gemCutUsage.bought.find((b: any) => b.gem === gema && b.cut === corte) || {};
      return {
        Gema: gema,
        Corte: corte,
        Veces_Disenada: gd.value || 0,
        Veces_Comprada: gb.value || 0
      };
    });
    const wsGem = XLSX.utils.json_to_sheet(gemasComp);
    wsGem['!cols'] = this.fitToColumn(gemasComp);
    XLSX.utils.book_append_sheet(wb, wsGem, 'Gemas_Cortes');

    // 4. PESTAÑA: BASES Y ENGASTES
    const todasBases = Array.from(new Set([
      ...data.bases.baseUsage.designed.map((b: any) => b.name),
      ...data.bases.baseUsage.bought.map((b: any) => b.name)
    ]));

    const basesComp = todasBases.map((nombre: any) => {
      const bd = data.bases.baseUsage.designed.find((b: any) => b.name === nombre) || {};
      const bb = data.bases.baseUsage.bought.find((b: any) => b.name === nombre) || {};
      return {
        Base: nombre,
        Diseno_Porcentaje: this.formatCurrency(bd.percentage) + '%',
        Compra_Porcentaje: this.formatCurrency(bb.percentage) + '%'
      };
    });
    const wsBas = XLSX.utils.json_to_sheet(basesComp);
    wsBas['!cols'] = this.fitToColumn(basesComp);
    XLSX.utils.book_append_sheet(wb, wsBas, 'Bases');

    const todosEngastes = Array.from(new Set([
      ...data.engastes.settingUsage.designed.map((e: any) => e.name),
      ...data.engastes.settingUsage.bought.map((e: any) => e.name)
    ]));

    const engastesComp = todosEngastes.map((nombre: any) => {
      const ed = data.engastes.settingUsage.designed.find((e: any) => e.name === nombre) || {};
      const eb = data.engastes.settingUsage.bought.find((b: any) => b.name === nombre) || {};
      return {
        Engaste: nombre.replace(/\n/g, ' '),
        Cantidad_Disenada: ed.quantity || 0,
        Cantidad_Comprada: eb.quantity || 0
      };
    });
    const wsSet = XLSX.utils.json_to_sheet(engastesComp);
    wsSet['!cols'] = this.fitToColumn(engastesComp);
    XLSX.utils.book_append_sheet(wb, wsSet, 'Engastes');

    // 5. PESTAÑA: SOURCES (CANALES)
    const sourcesTotales: any = { direct: 0, google: 0, instagram: 0, facebook: 0, tiktok: 0, wordpress: 0 };
    data.usuariosMensual.data.forEach((m: any) => {
      if (m.sources) {
        Object.keys(sourcesTotales).forEach(k => sourcesTotales[k] += (m.sources[k] || 0));
      }
    });
    const sourcesArray = Object.entries(sourcesTotales).map(([canal, total]) => ({
      Canal: canal.toUpperCase(),
      Total_Visitas_Anuales: total
    }));
    const wsSrc = XLSX.utils.json_to_sheet(sourcesArray);
    wsSrc['!cols'] = this.fitToColumn(sourcesArray);
    XLSX.utils.book_append_sheet(wb, wsSrc, 'Fuentes_Trafico');

    XLSX.writeFile(wb, `REPORTE_LOUV_${year}.xlsx`);
  }

  //---------- CSV + ZIP DE CSVs ----------------

  public getResumenData(data: any) {
    return data.usuariosMensual.data.map((m: any, i: number) => {
      const f = data.facturacion.data[i] || {};
      return {
        'Mes': this.meses[i],
        'Ingresos (€)': this.formatCurrency(f.ingresosTotales),
        'Ventas': f.totalProductos || 0,
        'Visitas Web': m.visits || 0,
        'Usuarios Activos': m.activeUsers || 0,
        'Recurrentes': m.returningUsers || 0
      };
    });
  }

  public getMetalesData(data: any) {
    const todosMetales = Array.from(new Set([
      ...data.materiales.materialUsage.designed.map((m: any) => m.material),
      ...data.materiales.materialUsage.bought.map((m: any) => m.material)
    ]));

    return todosMetales.map((nombre: any) => {
      const md = data.materiales.materialUsage.designed.find((m: any) => m.material === nombre) || {};
      const mb = data.materiales.materialUsage.bought.find((b: any) => b.material === nombre) || {};
        return {
            "Material": nombre,
            "Diseno_9K": md.k9 || 0,
            "Diseno_14K": md.k14 || 0, 
            "Diseno_18K": md.k18 || 0,
            "Diseno_Pt950": md.pt950 || 0, 
            "Venta_9K": mb.k9 || 0,
            "Venta_14K": mb.k14 || 0, 
            "Venta_18K": mb.k18 || 0,
            "Venta_Pt950": mb.pt950 || 0,
        };
    });
  }

  public getGemasData(data: any) {
    const todasGemasClave = Array.from(new Set([
      ...data.gemas.gemCutUsage.designed.map((g: any) => `${g.gem}|${g.cut}`),
      ...data.gemas.gemCutUsage.bought.map((g: any) => `${g.gem}|${g.cut}`)
    ]));

    return todasGemasClave.map((id: any) => {
      const [gema, corte] = id.split('|');
      const gd = data.gemas.gemCutUsage.designed.find((g: any) => g.gem === gema && g.cut === corte) || {};
      const gb = data.gemas.gemCutUsage.bought.find((b: any) => b.gem === gema && b.cut === corte) || {};
      return {
        'Gema': gema,
        'Corte': corte,
        'Cantidad_Disenada': gd.value || 0,
        'Cantidad_Vendida': gb.value || 0
      };
    });
  }

  public getBasesData(data: any) {
    const todasBases = Array.from(new Set([
      ...data.bases.baseUsage.designed.map((b: any) => b.name),
      ...data.bases.baseUsage.bought.map((b: any) => b.name)
    ]));

    return todasBases.map((nombre: any) => {
      const bd = data.bases.baseUsage.designed.find((b: any) => b.name === nombre) || {};
      const bb = data.bases.baseUsage.bought.find((b: any) => b.name === nombre) || {};
      return {
        'Configuracion_Base': nombre,
        'Popularidad_Diseno': this.formatCurrency(bd.percentage) + '%',
        'Popularidad_Venta': this.formatCurrency(bb.percentage) + '%'
      };
    });
  }

  public getEngastesData(data: any) {
    const todosEngastes = Array.from(new Set([
      ...data.engastes.settingUsage.designed.map((e: any) => e.name),
      ...data.engastes.settingUsage.bought.map((e: any) => e.name)
    ]));

    return todosEngastes.map((nombre: any) => {
      const ed = data.engastes.settingUsage.designed.find((e: any) => e.name === nombre) || {};
      const eb = data.engastes.settingUsage.bought.find((b: any) => b.name === nombre) || {};
      return {
        'Tipo_Engaste': nombre.replace(/\n/g, ' '),
        'Uso_en_Disenos': ed.quantity || 0,
        'Uso_en_Ventas': eb.quantity || 0
      };
    });
  }

  public getSourcesData(data: any) {
    const sourcesTotales: any = { direct: 0, google: 0, instagram: 0, facebook: 0, tiktok: 0, wordpress: 0 };
    data.usuariosMensual.data.forEach((m: any) => {
      if (m.sources) {
        Object.keys(sourcesTotales).forEach(k => sourcesTotales[k] += (m.sources[k] || 0));
      }
    });
    return Object.entries(sourcesTotales).map(([canal, total]) => ({
      'Canal': canal.toUpperCase(),
      'Total_Visitas_Anuales': total
    }));
  }


  private generateCSVContent(array: any[]): string {
    const ws = XLSX.utils.json_to_sheet(array);
    const BOM = '\uFEFF';
    return BOM + XLSX.utils.sheet_to_csv(ws, { FS: ';' });
  }

  public downloadSingleCSV(array: any[], fileName: string) {
    const content = this.generateCSVContent(array);
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();
  }


  async exportAllToZip(data: any) {
    const zip = new JSZip();
    const year = data.year || 2026;

    // Metemos todo al ZIP usando las funciones de arriba
    zip.file(`1_Resumen_Mensual_${year}.csv`, this.generateCSVContent(this.getResumenData(data)));
    zip.file(`2_Uso_Metales_${year}.csv`, this.generateCSVContent(this.getMetalesData(data)));
    zip.file(`3_Detalle_Gemas_${year}.csv`, this.generateCSVContent(this.getGemasData(data)));
    zip.file(`4_Bases_Joyeria_${year}.csv`, this.generateCSVContent(this.getBasesData(data)));
    zip.file(`5_Tipos_Engaste_${year}.csv`, this.generateCSVContent(this.getEngastesData(data)));
    zip.file(`6_Fuentes_Trafico_${year}.csv`, this.generateCSVContent(this.getSourcesData(data)));

    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `REPORTES_LOUV_COMPLETO_${year}.zip`;
    link.click();
  }
    
}
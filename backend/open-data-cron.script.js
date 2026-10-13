import 'dotenv/config';
import cron from 'node-cron';
import XLSX from 'xlsx';
import JSZip from 'jszip';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

import * as StatsService from './components/stats/stats.service.js';

const MESES = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
];

// Función para formato correcto en decimales
const formatCurrency = (value) => {
    return (value || 0).toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const transformers = {
    resumen: (data) =>
        data.usuariosMensual.map((m, i) => {
            const f = data.facturacion[i] || {};
            return {
                Mes: MESES[i],
                'Ingresos (€)': formatCurrency(f.ingresosTotales),
                Ventas: f.totalProductos || 0,
                'Visitas Web': m.visits || 0,
                'Usuarios Activos': m.activeUsers || 0,
                Recurrentes: m.returningUsers || 0,
            };
        }),

    metales: (data) => {
        const todos = Array.from(
            new Set([
                ...data.materiales.designed.map((m) => m.material),
                ...data.materiales.bought.map((m) => m.material),
            ])
        );
        return todos.map((nombre) => {
            const d = data.materiales.designed.find((m) => m.material === nombre) || {};
            const b = data.materiales.bought.find((m) => m.material === nombre) || {};
            return {
                Material: nombre,
                Diseno_9K: d.k9 || 0,
                Diseno_14K: d.k14 || 0,
                Diseno_18K: d.k18 || 0,
                Diseno_Pt950: d.pt950 || 0,
                Venta_9K: b.k9 || 0,
                Venta_14K: b.k14 || 0,
                Venta_18K: b.k18 || 0,
                Venta_Pt950: b.pt950 || 0,
            };
        });
    },

    gemas: (data) => {
        const claves = Array.from(
            new Set([
                ...data.gemas.designed.map((g) => `${g.gem}|${g.cut}`),
                ...data.gemas.bought.map((g) => `${g.gem}|${g.cut}`),
            ])
        );
        return claves.map((id) => {
            const [gema, corte] = id.split('|');
            const gd =
                data.gemas.designed.find((g) => g.gem === gema && g.cut === corte) || {};
            const gb =
                data.gemas.bought.find((g) => g.gem === gema && g.cut === corte) || {};
            return {
                Gema: gema,
                Corte: corte,
                Cantidad_Disenada: gd.value || 0,
                Cantidad_Vendida: gb.value || 0,
            };
        });
    },

    bases: (data) => {
        const todas = Array.from(
            new Set([
                ...data.bases.designed.map((b) => b.name),
                ...data.bases.bought.map((b) => b.name),
            ])
        );
        return todas.map((nombre) => {
            const d = data.bases.designed.find((b) => b.name === nombre) || {};
            const b = data.bases.bought.find((b) => b.name === nombre) || {};
            return {
                Configuracion_Base: nombre,
                Popularidad_Diseno: formatCurrency(d.percentage) + '%',
                Popularidad_Venta: formatCurrency(b.percentage) + '%',
            };
        });
    },

    engastes: (data) => {
        const todos = Array.from(
            new Set([
                ...data.engastes.designed.map((e) => e.name),
                ...data.engastes.bought.map((e) => e.name),
            ])
        );
        return todos.map((nombre) => {
            const d = data.engastes.designed.find((e) => e.name === nombre) || {};
            const b = data.engastes.bought.find((e) => e.name === nombre) || {};
            return {
                Tipo_Engaste: nombre.replace(/\n/g, ' '),
                Uso_en_Disenos: d.quantity || 0,
                Uso_en_Ventas: b.quantity || 0,
            };
        });
    },

    sources: (data) => {
        const totals = {
            direct: 0,
            google: 0,
            instagram: 0,
            facebook: 0,
            tiktok: 0,
            wordpress: 0,
        };
        data.usuariosMensual.forEach((m) => {
            if (m.sources)
                Object.keys(totals).forEach((k) => (totals[k] += m.sources[k] || 0));
        });
        return Object.entries(totals).map(([canal, total]) => ({
            Canal: canal.toUpperCase(),
            Total_Visitas_Anuales: total,
        }));
    },
};

async function generateAndSaveReports() {
    const year = new Date().getFullYear();
    const reportsDir = path.join(process.cwd(), 'reports');

    if (!existsSync(reportsDir)) mkdirSync(reportsDir);

    try {
        console.log(`[Cron] Generando reportes completos ${year}...`);

        const [facturacion, usuariosMensual, materiales, gemas, bases, engastes] =
            await Promise.all([
                StatsService.getYearlyOrdersStats(year),
                StatsService.getFullUserStats(year),
                StatsService.getMaterialUsageStats(year),
                StatsService.getGemCutUsageStats(year),
                StatsService.getBaseUsageStats(year),
                StatsService.getSettingUsageStats(year),
            ]);

        const fullData = {
            facturacion,
            usuariosMensual,
            materiales,
            gemas,
            bases,
            engastes,
        };

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
            wb,
            XLSX.utils.json_to_sheet(transformers.resumen(fullData)),
            'Resumen_Mensual'
        );
        XLSX.utils.book_append_sheet(
            wb,
            XLSX.utils.json_to_sheet(transformers.metales(fullData)),
            'Metales'
        );
        XLSX.utils.book_append_sheet(
            wb,
            XLSX.utils.json_to_sheet(transformers.gemas(fullData)),
            'Gemas'
        );
        XLSX.utils.book_append_sheet(
            wb,
            XLSX.utils.json_to_sheet(transformers.bases(fullData)),
            'Bases'
        );
        XLSX.utils.book_append_sheet(
            wb,
            XLSX.utils.json_to_sheet(transformers.engastes(fullData)),
            'Engastes'
        );
        XLSX.utils.book_append_sheet(
            wb,
            XLSX.utils.json_to_sheet(transformers.sources(fullData)),
            'Fuentes_Trafico'
        );
        //XLSX.writeFile(wb, path.join(reportsDir, `REPORTE_LOUV_${year}.xlsx`));

        const zip = new JSZip();
        const BOM = '\uFEFF';
        const toCSV = (arr) =>
            BOM + XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(arr), { FS: ';' });

        zip.file(`1_Resumen_Mensual_${year}.csv`, toCSV(transformers.resumen(fullData)));
        zip.file(`2_Uso_Metales_${year}.csv`, toCSV(transformers.metales(fullData)));
        zip.file(`3_Detalle_Gemas_${year}.csv`, toCSV(transformers.gemas(fullData)));
        zip.file(`4_Bases_Joyeria_${year}.csv`, toCSV(transformers.bases(fullData)));
        zip.file(`5_Tipos_Engaste_${year}.csv`, toCSV(transformers.engastes(fullData)));
        zip.file(`6_Fuentes_Trafico_${year}.csv`, toCSV(transformers.sources(fullData)));

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
        await fs.writeFile(path.join(reportsDir, `report.zip`), zipBuffer);

        console.log(`[Cron] ¡Hecho! Archivos guardados en /reports`);
    } catch (error) {
        console.error('[Cron] Error:', error);
    }
}

export async function startCronJobs() {
    cron.schedule(
        '0 0 * * 1',
        async () => {
            await generateAndSaveReports();
        },
        {
            timezone: 'Europe/Madrid',
        }
    );
}

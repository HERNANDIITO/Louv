import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs/promises';
import path from 'path';
import Jewelry from '../../db-schemas/jewelry.schema.js';

/* ───────────────────────── CONSTANTES Y CONFIG ───────────────────────── */
const COLORS = {
    black: rgb(86/255, 33/255, 115/255) ,  
    brand: rgb(238 / 255, 213 / 255, 242 / 255),
    label: rgb(0.5, 0.5, 0.5),        // Gris un poco más oscuro para legibilidad
    text: rgb(0.15, 0.15, 0.15),
    Whitetext: rgb(1, 1, 1),
    line: rgb(0.9, 0.9, 0.9)          // Gris ultra suave
};

const LAYOUT = {
    marginX: 50, // Márgenes ligeramente más estrechos para un look más "full width"
    marginY: 50,
    pageWidth: 595,
    pageHeight: 842,
    lineHeight: 45
};

/* ───────────────────────── HELPERS DE DIBUJO MODERNIZADOS ───────────────────────── */
const drawUI = {
    // Línea más elegante y minimalista
    line: (page, x, y, width) => {
        page.drawLine({
            start: { x, y },
            end: { x: x + width, y },
            thickness: 0.5,
            color: COLORS.line,
        });
    },

    // Label value con mejor espaciado vertical
    labelValue: (page, { label, value, x, y, fonts, size = 10 }) => {
        const safeValue = String(value ?? '-');
        
        page.drawText(label.toUpperCase(), {
            x, y,
            size: 8,
            font: fonts.bold,
            color: COLORS.black,
            characterSpacing: 1.2
        });

        page.drawText(safeValue, {
            x, y: y - 15,
            size,
            font: fonts.regular,
            color: COLORS.text,
        });
    },

    // Header de sección con un pequeño acento lateral en lugar de línea completa
    sectionHeader: (page, text, x, y, font) => {
        page.drawRectangle({
            x, y: y + 4,
            width: 16,
            height: 1,
            color: COLORS.black
        });
        page.drawText(text, { 
            x: x + 23, 
            y, 
            size: 16, 
            font, 
            characterSpacing: 1.5,
            color: COLORS.text
        });
    }
};

const calculateCarats = (gemstone, targetScaleFactor) => {
    if (!gemstone?.qualities || gemstone.qualities.length === 0) return 0;
    
    // Buscamos el rango de calidad que contiene nuestro scaleFactor
    const factor = parseFloat(targetScaleFactor);
    const quality = gemstone.qualities.find(q => {
        const minF = parseFloat(q.minScaleFactor);
        const maxF = parseFloat(q.maxScaleFactor);
        return factor >= minF && factor <= maxF;
    }) || gemstone.qualities[0]; // Si no lo encuentra, cogemos el primero por defecto

    const minF = parseFloat(quality.minScaleFactor);
    const maxF = parseFloat(quality.maxScaleFactor);
    const minC = quality.caratRangeMin;
    const maxC = quality.caratRangeMax;

    // Regla de tres / Interpolación lineal
    // Carats = minC + (factor - minF) * (maxC - minC) / (maxF - minF)
    if (maxF === minF) return minC; // Evitar división por cero
    
    const carats = minC + (factor - minF) * (maxC - minC) / (maxF - minF);
    return parseFloat(carats.toFixed(3)); // Retornamos con 3 decimales
};

/* ───────────────────────── FUNCIÓN PRINCIPAL ───────────────────────── */
const generateJewelryPDF = async (joya, withPrice) => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const [fontBytesRegular, fontBytesBold, fontBytesAbhaya, logoBytes] = await Promise.all([
        fs.readFile(path.join(process.cwd(), 'public/fonts/Montserrat-Regular.ttf')),
        fs.readFile(path.join(process.cwd(), 'public/fonts/Montserrat-Bold.ttf')),
        fs.readFile(path.join(process.cwd(), 'public/fonts/AbhayaLibre-Bold.ttf')),
        fs.readFile(path.join(process.cwd(), 'public/images/louv.png'))
    ]);

    const fonts = {
        regular: await pdfDoc.embedFont(fontBytesRegular),
        bold: await pdfDoc.embedFont(fontBytesBold),
        abhaya: await pdfDoc.embedFont(fontBytesAbhaya)
    };

    const logoImg = await pdfDoc.embedPng(logoBytes);

    let page = pdfDoc.addPage([LAYOUT.pageWidth, LAYOUT.pageHeight]);
    const { width, height } = page.getSize();

    // --- LÓGICA DE DATOS (INALTERADA) ---
    const jewelPopulated = await Jewelry.populate(joya, [
        { path: 'composition.baseStructure' },
        { path: 'composition.profile' },
        { path: 'composition.material' },
        { path: 'composition.size' },
        { 
            path: 'composition.settings.setting',
            populate: { path: 'clawNumber.compatibleCuts.clawType' }
        },
        { path: 'composition.settings.gemstone' },
        { path: 'composition.settings.gemstoneCut' },
        { 
          path: 'composition.settings.pattern.gemstone', 
          model: 'Gemstone' 
        },
        { path: 'box' },
        { path: 'boxInnerColor', model: 'BoxInnerMaterial' },
        { path: 'boxOuterColor', model: 'BoxOuterMaterial' },
        { path: 'boxDetailColor', model: 'BoxDetailMaterial' },
    ]);

    const targetVariantId = joya.composition?.variant?.toString();
    const variantData = jewelPopulated.composition?.baseStructure?.profiles
        ?.flatMap(p => p.variants || [])
        .find(v => v._id.toString() === targetVariantId) || { name: 'Estándar' };

    const targetPurityId = joya.composition?.materialPurity?.toString();
    const purityData = jewelPopulated.composition?.material?.purities
        ?.find(p => p._id.toString() === targetPurityId) || { purity: 'Estándar' };

    /* ───────────── RENDERIZADO CABECERA (ESTILO MODERNO) ───────────── */


    const bgBytes = await fs.readFile(
        path.join(process.cwd(), 'public/images/banner.jpg')
    );

    const bgImage = await pdfDoc.embedJpg(bgBytes);

    page.drawImage(bgImage, {
        x: -10,
        y: height - 148,
        width: 599,
        height: 152,
    });

    page.drawRectangle({
        x: 0,
        y: height - 150,
        width: width,
        height: 152,

        color: COLORS.black,

        opacity: 0.93
    });
        page.drawImage(logoImg, {
        x: 495,
        y: height - 60,
        width: 50,
        height: 16
    });

    page.drawText('ESPECIFICACIONES TÉCNICAS', { 
        x: LAYOUT.marginX, 
        y: height - 82, 
        size: 7, 
        font: fonts.bold, 
        color: COLORS.brand, 
        characterSpacing: 3 
    });

    page.drawText(joya?.name || 'DISEÑO SIN NOMBRE', { 
        x: LAYOUT.marginX, 
        y: height - 115, 
        size: 32, 
        font: fonts.abhaya,
        color: COLORS.Whitetext
    });

    // Gestión de Imagen Hero con "Sombra" o Marco
    try {
        const absoluteImagePath = path.join(process.cwd(), 'public', 'captures', joya.snapshot);
        const placeholderPath = path.join(process.cwd(), 'public', 'captures', 'solitario_diamante.png'); 

        let mainImg;

        try {
            // Intentamos cargar la imagen real
            const imgBytes = await fs.readFile(absoluteImagePath);
            mainImg = await pdfDoc.embedPng(imgBytes);
        } catch (e) {

            //Si falla, intentamos cargar la imagen por defecto
            const placeholderBytes = await fs.readFile(placeholderPath);
            mainImg = await pdfDoc.embedPng(placeholderBytes);
        }

        const heroSize = 210;
        const scale = Math.min(heroSize / mainImg.width, heroSize / mainImg.height);
        const imgW = mainImg.width * scale;
        const imgH = mainImg.height * scale;


        page.drawImage(mainImg, {
            x: width - imgW - LAYOUT.marginX,
            y: height - imgH - 168,
            width: imgW,
            height: imgH,
        });
    } catch (e) {
    }

    /* ───────────── BLOQUE IZQUIERDO (INFO DESTACADA) ───────────── */
    let currentY = height - 203;
    const formattedDate = new Date(joya?.creationDate || Date.now()).toLocaleDateString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
    
    drawUI.sectionHeader(page, 'Información general', LAYOUT.marginX, currentY, fonts.abhaya);
    
    currentY -= 30;
    const heroSpecs = [
        { label: 'Fecha de creación', value: formattedDate },
        { label: 'Modelo Base', value: jewelPopulated.composition?.baseStructure?.name },
        { label: 'Variante Seleccionada', value: variantData.name },
    ];

    heroSpecs.forEach(spec => {
        drawUI.labelValue(page, { ...spec, x: LAYOUT.marginX, y: currentY, fonts });
        currentY -= 38;
    });

    const priceValue = Math.round(joya.taxablePrice * 100) / 100;

    if(withPrice) {
      drawUI.labelValue(page, { label:'Precio Estimado (IVA Incluido)', value:`${priceValue} EUR` , x: LAYOUT.marginX, y: currentY, fonts });
      currentY -= 40;
    }

    /* ───────────── CUERPO TÉCNICO (ESTILO GRID) ───────────── */
    currentY = currentY - 21; 
    drawUI.line(page, LAYOUT.marginX, currentY + 20, width - 2*LAYOUT.marginX);
    currentY -= 9;
    // Materiales
    drawUI.sectionHeader(page, 'Composición de argolla', LAYOUT.marginX, currentY, fonts.abhaya);
    currentY -= 30;
    
    const matFull = `${jewelPopulated.composition?.material?.name || 'Metal'} ${purityData.purity}`;
    drawUI.labelValue(page, { label: 'Metal Principal', value: matFull, x: LAYOUT.marginX, y: currentY, fonts });
    drawUI.labelValue(page, { label: 'Tipo de Perfil', value: jewelPopulated.composition?.profile?.name, x: 230, y: currentY, fonts });
    drawUI.labelValue(page, { label: 'Talla', value: `${jewelPopulated.composition?.size?.name} (${jewelPopulated.composition?.size?.system})`, x: 410, y: currentY, fonts });

    // Gemas
    currentY -= 62;
    drawUI.line(page, LAYOUT.marginX, currentY + 20, width - 2*LAYOUT.marginX);
    currentY -= 9;
    
    if(jewelPopulated.composition?.settings.length > 0) {
      drawUI.sectionHeader(page, 'Gemas y engastes', LAYOUT.marginX, currentY, fonts.abhaya);
      currentY -= 30;
    }

    (jewelPopulated.composition?.settings || []).forEach((s, index) => {
        if (currentY < 150) { 
            page = pdfDoc.addPage([595, 842]); 
            currentY = 780; 
        }

        const fNum = s.setting?.clawNumber?.find(n => n._id.toString() === s.clawNumber?.toString());
        const nClaw = fNum?.name || 'N/A';
        const clawTypeObj = fNum?.compatibleCuts
          ?.find(c => c.cut._id?.toString() === s.gemstoneCut?._id?.toString() || c.cut.toString() === s.gemstoneCut?.toString())
          ?.clawType?.find(t => t._id.toString() === s.clawType?.toString());

        const tClawName = clawTypeObj?.name || 'N/A';

        if(s.gemstone?.name !== "None" && s.setting?.type[0] !== "embeded") {

          const settingConfig = variantData?.settingsInfo?.find(si => si.gemPosId === index+1);
          const settingSize = settingConfig.defaultsettingSize[0];
          const compatible = settingConfig?.compatibleSettings?.find(cs => 
              cs.setting.toString() === s.setting?._id.toString()
          );
          const scaleEntry = compatible?.scalePerSettingSize?.find(pr =>  pr.size[0] === settingSize
          );

          const finalScale = scaleEntry ? scaleEntry.scale : 1;
          const unitCarats = calculateCarats(s.gemstone, finalScale);

          drawUI.labelValue(page, { label: `Gema principal ${index + 1}`, value: `${s.gemstone?.name} ${s.isSynthetic === true ? "sintético" : "sintético"} · ${s.gemstoneCut?.name} · ${unitCarats} cts `, x: LAYOUT.marginX, y: currentY, fonts });
          drawUI.labelValue(page, { label: 'Configuración de Engaste', value: `${s.setting?.name || 'Base'} · ${nClaw} · ${tClawName}`, x: LAYOUT.marginX + 270, y: currentY, fonts });

          currentY -= LAYOUT.lineHeight;
        }

        if (s.pattern && s.pattern.length > 0) {
          const patternData = clawTypeObj?.availablePatterns?.find(p => 
            p._id.toString() === s.pattern[0].pattern._id.toString()
          );

          if (patternData && patternData.gemstones) {
              // Agrupamos y contamos gemas por groupNumber
              const countsByGroup = patternData.gemstones.reduce((acc, gem) => {
                  const group = gem.groupNumber || 0;
                  acc[group] = (acc[group] || 0) + 1;
                  return acc;
              }, {});

              // Buscar la gema que corresponde a la primera gema de cada grupo
              const firstIndexPerGroup = {};
              patternData.gemstones.forEach((gem, index) => {
                  const group = gem.groupNumber || 0;
                  if (firstIndexPerGroup[group] === undefined) {
                      firstIndexPerGroup[group] = index;
                  }
              });

              let currentX = LAYOUT.marginX;
              // Iterar sobre los grupos 
              Object.keys(countsByGroup).forEach((groupKey) => {
                  const count = countsByGroup[groupKey];
                  const targetIndex = firstIndexPerGroup[parseInt(groupKey)];
                  const actualGemInfo = s.pattern[0]?.gemstone[targetIndex];
                  const isSynthetic = s.pattern[0]?.isSynthetic[targetIndex];
                  const scaleFactor = patternData.gemstones[targetIndex]?.scaleFactor || 1;

                  const unitCarats = calculateCarats(actualGemInfo, scaleFactor);
                  const totalGroupCarats = (unitCarats * count).toFixed(2);

                  const label = `Gemas patrón (grupo ${parseInt(groupKey) + 1}) `;
                  const value = `×${count} ${actualGemInfo?.name || 'Gema'} ${isSynthetic === true ? "sintético" : "sintético"} · ${s.gemstoneCut?.name || 'Corte'} · ${unitCarats} cts`;

                  drawUI.labelValue(page, { 
                      label: label, 
                      value: value, 
                      x: LAYOUT.marginX, 
                      y: currentY, 
                      fonts 
                  });
                    currentY -= LAYOUT.lineHeight - 10;
              });
          }
        } 
        
    });

    /* ───────────── FOOTER (LIMPIO) ───────────── */
    const footerY = 40;
    drawUI.line(page, LAYOUT.marginX, footerY + 15, width - (LAYOUT.marginX * 2));
    page.drawText('LOUV · PATATA TEAM', { 
        x: LAYOUT.marginX, 
        y: footerY, 
        size: 6, 
        font: fonts.bold, 
        color: COLORS.label, 
        characterSpacing: 1.5 
    });

    page.drawText('2026', { 
        x: width - LAYOUT.marginX - 20, 
        y: footerY, 
        size: 6, 
        font: fonts.regular, 
        color: COLORS.brand 
    });

    return await pdfDoc.save();
};

export default generateJewelryPDF;
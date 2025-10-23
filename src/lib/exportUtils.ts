// src/lib/exportUtils.ts
import type { TabJSON, TabMeasure, TabNote } from './tabGenerator';

/**
 * Konvertiert eine SVG-Node in einen PNG-Datenstrom und löst den Download aus.
 * @param svgId Die ID des SVG-Elements im DOM (z.B. 'tab-svg-renderer')
 * @param filename Dateiname für den Download
 */
export function exportToPNG(svgId: string, filename = 'guitarskillz-tab.png') {
  const svgElement = document.getElementById(svgId) as SVGSVGElement | null;
  if (!svgElement) {
    console.error('SVG-Element nicht gefunden');
    return;
  }

  const svgString = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    // PNG-Größe skalieren (optional)
    const scale = 2;
    canvas.width = (svgElement.clientWidth || 800) * scale;
    canvas.height = (svgElement.clientHeight || 160) * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Hintergrund weiß füllen (da SVG transparent sein kann)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);

    // Download auslösen
    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  img.src = url;
}

/**
 * Nimmt den SVG-String und löst einen Download aus.
 * @param svgId Die ID des SVG-Elements im DOM
 * @param filename Dateiname für den Download
 */
export function exportToSVG(svgId: string, filename = 'guitarskillz-tab.svg') {
  const svgElement = document.getElementById(svgId);
  if (!svgElement) return;

  const svgString = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// --- ASCII-Export-Logik ---

// Hilfsfunktion: Fügt eine Note zu den ASCII-Zeilen hinzu
function addNoteToAscii(
  lines: string[],
  note: TabNote,
  position: number,
  durationChar: string,
) {
  const stringIndex = 6 - note.string; // Konvertiert Saite (1-6) zu Array-Index (5-0)
  
  // Stelle sicher, dass die Linie lang genug ist
  for (let i = 0; i < 6; i++) {
    lines[i] = lines[i].padEnd(position, '-');
  }

  // Setze die Bundnummer (ggf. zweistellig)
  const fretStr = String(note.fret);
  lines[stringIndex] = 
    lines[stringIndex].substring(0, position) + 
    fretStr + 
    lines[stringIndex].substring(position + fretStr.length);

  // Füge Dauer-Markierung hinzu (optional, hier vereinfacht)
  // lines[6][position] = durationChar; 
}

/**
 * Konvertiert das Tab-JSON in einen ASCII-String und kopiert ihn in die Zwischenablage.
 * @param tabData Das TabJSON-Objekt
 */
export async function copyAsASCII(tabData: TabJSON) {
  if (!tabData) return;

  let asciiOutput = `GuitarSkillz.com - Tempo: ${tabData.meta.tempo} BPM\n\n`;
  const DURATION_MAP: Record<string, number> = { 'sixteenth': 4, 'eighth': 8, 'quarter': 16, 'half': 32 };
  
  tabData.measures.forEach((measure) => {
    // Initialisiere die 6 Saiten-Linien für diesen Takt
    const measureLines = [
      'e|', // String 1
      'B|', // String 2
      'G|', // String 3
      'D|', // String 4
      'A|', // String 5
      'E|', // String 6
      // ' |', // (Für Rhythmus)
    ];
    let currentPosition = 2; // Start nach 'e|'

    measure.forEach((note) => {
      // Bestimme, wie viel Platz diese Note einnimmt
      const noteWidth = String(note.fret).length + 1; // Platz für Zahl + '-'
      
      // Füge die Note an der aktuellen Position ein
      const stringIndex = 6 - note.string;
      for(let i=0; i < 6; i++) {
         measureLines[i] = measureLines[i].padEnd(currentPosition, '-');
         if (i === stringIndex) {
            measureLines[i] += note.fret;
         } else {
            measureLines[i] += '-'.repeat(String(note.fret).length);
         }
      }
      currentPosition += noteWidth;
    });

    // Takt abschließen
    measureLines.forEach(line => {
      asciiOutput += line.padEnd(currentPosition + 2, '-') + '|\n';
    });
    asciiOutput += '\n'; // Leerraum zwischen Takten
  });

  // In Zwischenablage kopieren
  try {
    await navigator.clipboard.writeText(asciiOutput);
    alert('ASCII-Tab in die Zwischenablage kopiert!');
  } catch (err) {
    console.error('Fehler beim Kopieren in die Zwischenablage:', err);
    alert('Kopieren fehlgeschlagen.');
  }
}
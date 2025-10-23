// src/lib/tabGenerator.ts

/**
 * Kernlogik für den Random Tab Generator.
 * Stellt sicher, dass Tabs "hand-reachable" sind.
 */

// --- Typen-Definitionen ---

export type NoteDuration = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth';
export type NoteTech = 'none' | 'hammer' | 'pull' | 'slide' | 'bend';

export interface TabNote {
  string: number; // 1-6 (E-e)
  fret: number;   // 0-15
  duration: NoteDuration;
  tech: NoteTech;
  // Später: finger (1-4)
}

export type TabMeasure = TabNote[];

export interface TabSettings {
  measures: number;    // 1-8
  complexity: 'easy' | 'medium' | 'hard';
  maxStretch: number;  // 4-6 (max Bünde zwischen Noten)
  tabRange: number;    // 2-6 (z.B. 4 = nur auf G,B,e,A spielen)
  tempo: number;       // BPM
}

export interface TabJSON {
  meta: TabSettings & { strings: 6 };
  measures: TabMeasure[];
}

// --- Interne Hilfsvariablen ---

const DURATION_VALUE: Record<NoteDuration, number> = {
  'whole': 1.0,
  'half': 0.5,
  'quarter': 0.25,
  'eighth': 0.125,
  'sixteenth': 0.0625,
};

const BASE_STRING = 6; // Start auf der tiefen E-Saite

// --- Hilfsfunktionen ---

/**
 * Wählt ein zufälliges Element aus einem Array.
 */
function choice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generiert eine Zufallszahl in einem Bereich (min/max inklusiv).
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Kernlogik: Prüft, ob eine neue Note von der letzten aus spielbar ist.
 * @param prevNote Die vorherige Note.
 * @param newNote Die zu prüfende neue Note.
 * @param maxStretch Maximaler Bund-Abstand (Spreizung).
 * @returns boolean
 */
function isHandReachable(prevNote: TabNote | null, newNote: TabNote, maxStretch: number): boolean {
  if (!prevNote) return true; // Erste Note ist immer erreichbar
  if (prevNote.string === newNote.string) return true; // Gleiche Saite, immer ok
  if (newNote.fret === 0) return true; // Offene Saite, immer ok
  
  const fretDistance = Math.abs(prevNote.fret - newNote.fret);
  
  // Wenn die vorherige Note eine offene Saite war, ist der Stretch irrelevant.
  if (prevNote.fret === 0) return true;

  return fretDistance <= maxStretch;
}

/**
 * Generiert die nächste Note basierend auf der Komplexität und der vorherigen Note.
 * Passt die Note an, wenn sie nicht erreichbar ist.
 */
function getNextNote(prevNote: TabNote | null, settings: TabSettings): TabNote {
  const { complexity, maxStretch, tabRange } = settings;

  // 1. Dauer auswählen
  let durations: NoteDuration[];
  switch (complexity) {
    case 'hard':
      durations = ['eighth', 'sixteenth', 'sixteenth'];
      break;
    case 'medium':
      durations = ['quarter', 'eighth', 'eighth'];
      break;
    case 'easy':
    default:
      durations = ['quarter', 'quarter', 'half'];
      break;
  }
  const duration = choice(durations);

  // 2. Saite auswählen (tabRange begrenzt die Auswahl)
  // tabRange=4 bedeutet, wir spielen auf Saiten 1, 2, 3, 4
  const minString = BASE_STRING - tabRange + 1;
  const newString = randomInt(minString, BASE_STRING);

  // 3. Bund auswählen
  let newFret: number;
  const minFret = 0;
  const maxFret = 15;

  if (!prevNote || prevNote.fret === 0) {
    // Erste Note oder nach offener Saite: Freie Wahl
    newFret = randomInt(minFret, complexity === 'easy' ? 5 : 12);
  } else {
    // Versuche, eine Note in Reichweite zu finden
    const minReachable = Math.max(minFret, prevNote.fret - maxStretch);
    const maxReachable = Math.min(maxFret, prevNote.fret + maxStretch);
    
    // 50% Chance, in Reichweite zu bleiben, 50% zu springen (wird ggf. korrigiert)
    if (Math.random() > 0.5) {
      newFret = randomInt(minReachable, maxReachable);
    } else {
      newFret = randomInt(minFret, maxFret); // Springen
    }
  }

  // 4. Note erstellen
  const candidateNote: TabNote = {
    string: newString,
    fret: newFret,
    duration: duration,
    tech: 'none', // TODO: Tech hinzufügen (hammer/pull)
  };

  // 5. Erreichbarkeit prüfen und KORRIGIEREN
  if (!isHandReachable(prevNote, candidateNote, maxStretch)) {
    // Nicht erreichbar! Korrektur: Clamp Fret in Reichweite der prevNote.
    if (candidateNote.fret > prevNote.fret) {
      candidateNote.fret = prevNote.fret + randomInt(1, maxStretch);
    } else {
      candidateNote.fret = prevNote.fret - randomInt(1, maxStretch);
    }
    // Stelle sicher, dass wir im gültigen Bereich (0-15) bleiben
    candidateNote.fret = Math.max(minFret, Math.min(maxFret, candidateNote.fret));
  }
  
  return candidateNote;
}


// --- Hauptfunktion ---

/**
 * Generiert ein komplettes Tab-JSON-Objekt basierend auf den Einstellungen.
 * @param settings Die Benutzereinstellungen.
 * @returns TabJSON
 */
export function generateTab(settings: TabSettings): TabJSON {
  const measures: TabMeasure[] = [];
  let lastNote: TabNote | null = null;

  for (let i = 0; i < settings.measures; i++) {
    const currentMeasure: TabMeasure = [];
    let measureDuration = 0.0;

    // Fülle den Takt (4/4 Takt = 1.0)
    while (measureDuration < 1.0) {
      const note = getNextNote(lastNote, settings);
      const noteDurationValue = DURATION_VALUE[note.duration];

      // Prüfe, ob die Note noch in den Takt passt
      if (measureDuration + noteDurationValue <= 1.0) {
        currentMeasure.push(note);
        measureDuration += noteDurationValue;
        lastNote = note;
      } else if (measureDuration < 1.0) {
        // Fülle den Takt mit einer passenden Pause oder Note
        // Vereinfachung: Wir füllen mit einer passenden Note
        const remainingDuration = 1.0 - measureDuration;
        
        // Finde die größte Note, die passt (vereinfacht)
        let fillDuration: NoteDuration = 'sixteenth';
        if (remainingDuration >= 0.25) fillDuration = 'quarter';
        else if (remainingDuration >= 0.125) fillDuration = 'eighth';

        note.duration = fillDuration;
        currentMeasure.push(note);
        measureDuration += DURATION_VALUE[fillDuration];
        lastNote = note;
      } else {
         // Sollte nicht passieren, aber sicher ist sicher
         break;
      }
    }
    measures.push(currentMeasure);
  }

  return {
    meta: {
      ...settings,
      strings: 6,
    },
    measures: measures,
  };
}
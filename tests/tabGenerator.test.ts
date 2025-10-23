// tests/tabGenerator.test.ts
import { describe, it, expect } from 'vitest';
import { generateTab, TabSettings, TabNote } from '../src/lib/tabGenerator';

// Standardeinstellungen für Tests
const testSettings: TabSettings = {
  measures: 4,
  complexity: 'medium',
  maxStretch: 4,
  tabRange: 6,
  tempo: 120,
};

describe('tabGenerator', () => {

  it('should generate a tab with the correct number of measures', () => {
    const tab = generateTab(testSettings);
    expect(tab.measures).toHaveLength(testSettings.measures);
  });

  it('should include correct meta-information', () => {
    const tab = generateTab(testSettings);
    expect(tab.meta.measures).toBe(testSettings.measures);
    expect(tab.meta.complexity).toBe('medium');
    expect(tab.meta.strings).toBe(6);
  });

  it('should only generate notes within the fret range (0-15)', () => {
    const tab = generateTab({ ...testSettings, measures: 8, complexity: 'hard' });
    let allFretsValid = true;
    tab.measures.forEach(measure => {
      measure.forEach(note => {
        if (note.fret < 0 || note.fret > 15) {
          allFretsValid = false;
        }
      });
    });
    expect(allFretsValid).toBe(true);
  });

  it('should only generate notes within the tabRange', () => {
    const settings: TabSettings = { ...testSettings, tabRange: 3 }; // Spielt auf Saiten 4, 5, 6
    const tab = generateTab(settings);
    let allStringsValid = true;
    tab.measures.forEach(measure => {
      measure.forEach(note => {
        // (6 - 3 + 1) = 4. Saiten 4, 5, 6 sind erlaubt.
        if (note.string < 4) {
          allStringsValid = false;
        }
      });
    });
    expect(allStringsValid).toBe(true);
  });

  it('should respect maxStretch (hand-reachability)', () => {
    const strictSettings: TabSettings = {
      ...testSettings,
      measures: 4,
      complexity: 'hard',
      maxStretch: 3, // Sehr strenge Spreizung
    };
    const tab = generateTab(strictSettings);
    
    let previousNote: TabNote | null = null;
    let stretchViolated = false;

    tab.measures.forEach(measure => {
      measure.forEach(note => {
        if (previousNote) {
          // Prüfe nur, wenn Bünde > 0 und Saiten unterschiedlich
          if (previousNote.fret > 0 && note.fret > 0 && previousNote.string !== note.string) {
            if (Math.abs(previousNote.fret - note.fret) > strictSettings.maxStretch) {
              stretchViolated = true;
            }
          }
        }
        previousNote = note;
      });
    });

    expect(stretchViolated).toBe(false);
  });

  it('should fill measures completely (or very close to 1.0)', () => {
    const DURATION_VALUE = { 'whole': 1.0, 'half': 0.5, 'quarter': 0.25, 'eighth': 0.125, 'sixteenth': 0.0625 };
    const tab = generateTab({ ...testSettings, complexity: 'hard' });

    tab.measures.forEach(measure => {
      let durationSum = 0;
      measure.forEach(note => {
        durationSum += DURATION_VALUE[note.duration as keyof typeof DURATION_VALUE];
      });
      // Erlaube leichte Rundungsfehler, aber im Grunde muss der Takt voll sein
      expect(durationSum).toBeGreaterThanOrEqual(1.0);
    });
  });

});
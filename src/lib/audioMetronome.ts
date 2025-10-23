// src/lib/audioMetronome.ts

/**
 * Ein einfaches Metronom mit der WebAudio API.
 */
export class Metronome {
  private audioContext: AudioContext | null;
  private isRunning: boolean;
  private nextNoteTime: number;
  private scheduleAheadTime: number; // Wie weit im Voraus planen (Sekunden)
  private lookahead: number; // Wie oft der Scheduler läuft (ms)
  private timerID?: number;
  private currentBeat: number;
  private beatsPerMeasure: number;
  private tempo: number;

  constructor() {
    this.audioContext = null;
    this.isRunning = false;
    this.nextNoteTime = 0.0;
    this.scheduleAheadTime = 0.1;
    this.lookahead = 25.0;
    this.currentBeat = 0;
    this.beatsPerMeasure = 4;
    this.tempo = 120;
  }

  private initAudio() {
    if (this.audioContext === null) {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
  }

  /**
   * Plant die nächste Note (den Tick).
   */
  private scheduleNote() {
    if (!this.audioContext) return;

    // Erzeuge einen Oszillator (einfacher Piepton)
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    // Beat 1 (Downbeat) ist lauter/höher
    if (this.currentBeat % this.beatsPerMeasure === 0) {
      osc.frequency.setValueAtTime(880.0, this.nextNoteTime); // A5
      gain.gain.setValueAtTime(0.8, this.nextNoteTime);
    } else {
      osc.frequency.setValueAtTime(440.0, this.nextNoteTime); // A4
      gain.gain.setValueAtTime(0.5, this.nextNoteTime);
    }

    // Kurzer "Tick"
    osc.start(this.nextNoteTime);
    osc.stop(this.nextNoteTime + 0.05);
  }

  /**
   * Der Scheduler-Loop, der prüft, wann die nächste Note geplant werden muss.
   */
  private scheduler() {
    if (!this.audioContext) return;

    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote();
      
      // Zeit für den nächsten Beat berechnen
      const secondsPerBeat = 60.0 / this.tempo;
      this.nextNoteTime += secondsPerBeat;
      
      // Nächsten Beat hochzählen
      this.currentBeat = (this.currentBeat + 1) % this.beatsPerMeasure;
    }

    // Den Timer für den nächsten Durchlauf setzen
    this.timerID = window.setTimeout(() => this.scheduler(), this.lookahead);
  }

  public start(tempo: number) {
    if (this.isRunning) return;

    this.initAudio();
    if (!this.audioContext) return;

    this.isRunning = true;
    this.tempo = tempo;
    this.currentBeat = 0;
    this.nextNoteTime = this.audioContext.currentTime + 0.1; // Starte leicht verzögert
    
    this.scheduler();
  }

  public stop() {
    this.isRunning = false;
    if (this.timerID) {
      window.clearTimeout(this.timerID);
    }
  }

  public toggle(tempo: number) {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start(tempo);
    }
  }
}
// src/components/GeneratorWidget.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateTab, TabJSON, TabSettings } from '@/lib/tabGenerator';
import TabViewport from './TabViewport';
import Controls from './Controls';
import SettingsPanel from './SettingsPanel';
// Annahme: Diese Utils existieren
// import { exportToSVG, exportToPNG, copyAsASCII } from '@/lib/exportUtils';
// import { Metronome } from '@/lib/audioMetronome';

// Standardeinstellungen
const defaultSettings: TabSettings = {
  measures: 4,
  complexity: 'medium',
  maxStretch: 4,
  tabRange: 4,
  tempo: 90,
};

export default function GeneratorWidget() {
  const [settings, setSettings] = useState<TabSettings>(defaultSettings);
  const [tabData, setTabData] = useState<TabJSON | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Playhead-Position als % (0.0 bis 1.0)
  const [playheadPosition, setPlayheadPosition] = useState(0);

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  // const metronomeRef = useRef<Metronome | null>(null);

  // Initialer Tab-Ladevorgang
  useEffect(() => {
    handleNext();
    // metronomeRef.current = new Metronome();
  }, []);
  
  // Neuberechnung der Gesamtdauer der Animation
  const totalDurationMs = (settings.measures * 4 * 60 * 1000) / settings.tempo;

  // Animations-Loop für den Playhead
  const animatePlayhead = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsedTime = timestamp - startTimeRef.current;
    let newPosition = elapsedTime / totalDurationMs;

    if (newPosition >= 1.0) {
      // Loop oder Stop/Next
      newPosition = 1.0;
      setIsPlaying(false);
      setPlayheadPosition(0);
      startTimeRef.current = null;
      // Optional: handleNext();
    } else {
      setPlayheadPosition(newPosition);
      animationFrameRef.current = requestAnimationFrame(animatePlayhead);
    }
  };

  // Effekt zum Starten/Stoppen der Animation
  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = null; // Reset Startzeit
      // metronomeRef.current?.start(settings.tempo);
      animationFrameRef.current = requestAnimationFrame(animatePlayhead);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // metronomeRef.current?.stop();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, settings.tempo, settings.measures]); // Abhängig von isPlaying und Dauer


  // --- Event Handlers ---

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      // Wenn am Ende, starte von vorn
      if (playheadPosition >= 1.0) {
        setPlayheadPosition(0);
      }
      setIsPlaying(true);
    }
  }, [isPlaying, playheadPosition]);

  const handleNext = useCallback(() => {
    setIsPlaying(false);
    setPlayheadPosition(0);
    startTimeRef.current = null;
    setTabData(generateTab(settings));
  }, [settings]);

  const handleSettingsChange = useCallback((newSettings: Partial<TabSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    // Wenn sich Takte oder Tempo ändern, während abgespielt wird -> stoppen
    if (newSettings.measures || newSettings.tempo) {
      setIsPlaying(false);
      setPlayheadPosition(0);
    }
  }, []);
  
  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      }
      if (e.code === 'KeyN') {
        e.preventDefault();
        handleNext();
      }
      // TODO: Pfeiltasten für Tempo
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause, handleNext]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* Linke Spalte: Einstellungen */}
      <div className="lg:w-1/4 w-full">
        <SettingsPanel 
          settings={settings} 
          onSettingsChange={handleSettingsChange} 
        />
      </div>

      {/* Rechte Spalte: Viewport und Controls */}
      <div className="lg:w-3/4 w-full">
        <Controls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onExportSVG={() => { /* exportToSVG(...) */ }}
          onExportPNG={() => { /* exportToPNG(...) */ }}
          onCopyASCII={() => { /* copyAsASCII(tabData) */ }}
        />

        {/* Viewport-Bereich */}
        <div 
          id="tab-viewport-wrapper" 
          className="relative w-full bg-white shadow-lg rounded-lg border border-gray-200 overflow-x-auto mt-4"
          aria-live="polite"
          role="region"
          aria-label={`Tab-Ansicht. ${isPlaying ? 'Spielt' : 'Pausiert'}`}
        >
          {tabData ? (
            <TabViewport tabData={tabData} />
          ) : (
            <div className="p-8 text-center text-gray-500">Lade Generator...</div>
          )}
          
          {/* Playhead (Overlay Div) */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary-DEFAULT/80"
            style={{
              left: `${playheadPosition * 100}%`,
              transition: isPlaying ? 'none' : 'left 0.1s ease-out',
            }}
            aria-hidden="true"
          ></div>
        </div>
      </div>
    </div>
  );
}
// src/components/Controls.tsx
import React from 'react';

// Annahme: Icons werden importiert, z.B. von 'react-icons'
// Hier als Text-Platzhalter
const PlayIcon = () => <span>▶</span>;
const PauseIcon = () => <span>❚❚</span>;
const NextIcon = () => <span>icon(Next)</span>;
const ExportIcon = () => <span>icon(Export)</span>;

interface Props {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onExportSVG: () => void;
  onExportPNG: () => void;
  onCopyASCII: () => void;
}

// Ein einfacher Button-Wrapper für einheitliches Styling
const ControlButton: React.FC<React.PropsWithChildren<{ onClick: () => void; 'aria-label': string }>> = ({ children, onClick, 'aria-label': ariaLabel }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    className="p-3 bg-light-100 text-dark-900 rounded-lg shadow-sm hover:bg-light-300 focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT"
  >
    {children}
  </button>
);

export default function Controls({
  isPlaying,
  onPlayPause,
  onNext,
  onExportSVG,
  onExportPNG,
  onCopyASCII,
}: Props) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <button
        type="button"
        onClick={onPlayPause}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="flex items-center justify-center w-14 h-14 bg-primary-DEFAULT text-white rounded-full shadow-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2"
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <ControlButton onClick={onNext} aria-label="Nächsten Tab generieren (N)">
        <NextIcon /> Next
      </ControlButton>
      
      <div className="border-l border-gray-300 h-8 mx-2"></div>

      {/* Hier könnte ein Dropdown für Exporte sein */}
      <ControlButton onClick={onExportSVG} aria-label="Als SVG exportieren">
        Export SVG
      </ControlButton>
      <ControlButton onClick={onExportPNG} aria-label="Als PNG exportieren">
        Export PNG
      </ControlButton>
      <ControlButton onClick={onCopyASCII} aria-label="Als ASCII-Text kopieren">
        Copy ASCII
      </ControlButton>
    </div>
  );
}
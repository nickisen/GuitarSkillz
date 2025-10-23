// src/components/SettingsPanel.tsx
import React from 'react';
import type { TabSettings } from '@/lib/tabGenerator';

interface Props {
  settings: TabSettings;
  onSettingsChange: (newSettings: Partial<TabSettings>) => void;
}

// Generische Komponente für einen Slider
const SettingSlider: React.FC<{
  label: string;
  id: keyof TabSettings;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (id: keyof TabSettings, value: number) => void;
}> = ({ label, id, min, max, step, value, onChange }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-dark-900 mb-1">
      {label}: <span className="font-bold text-primary-DEFAULT">{value}</span>
    </label>
    <input
      type="range"
      id={id}
      name={id}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(id, parseInt(e.target.value, 10))}
      className="w-full h-2 bg-light-300 rounded-lg appearance-none cursor-pointer"
    />
  </div>
);

// Generische Komponente für ein Select (Dropdown)
const SettingSelect: React.FC<{
  label: string;
  id: keyof TabSettings;
  value: string | number;
  options: { value: string | number; label: string }[];
  onChange: (id: keyof TabSettings, value: string) => void;
}> = ({ label, id, value, options, onChange }) => (
  <div className="mb-4">
     <label htmlFor={id} className="block text-sm font-medium text-dark-900 mb-1">
      {label}
    </label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);


export default function SettingsPanel({ settings, onSettingsChange }: Props) {
  
  const handleSliderChange = (id: keyof TabSettings, value: number) => {
    onSettingsChange({ [id]: value });
  };
  
  const handleSelectChange = (id: keyof TabSettings, value: string) => {
     onSettingsChange({ [id]: value });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold text-dark-900 mb-4 border-b pb-2">
        Einstellungen
      </h2>

      {/* Tempo (BPM) */}
      <SettingSlider
        label="Tempo (BPM)"
        id="tempo"
        min={40}
        max={200}
        step={5}
        value={settings.tempo}
        onChange={handleSliderChange}
      />
      
      {/* Takte (Measures) */}
      <SettingSlider
        label="Takte"
        id="measures"
        min={1}
        max={8}
        step={1}
        value={settings.measures}
        onChange={handleSliderChange}
      />

      {/* Komplexität */}
      <SettingSelect
        label="Komplexität"
        id="complexity"
        value={settings.complexity}
        options={[
          { value: 'easy', label: 'Einfach (Viertel/Halbe)' },
          { value: 'medium', label: 'Mittel (Achtel)' },
          { value: 'hard', label: 'Schwer (Sechzehntel)' },
        ]}
        onChange={handleSelectChange}
      />
      
      {/* Max Stretch */}
      <SettingSlider
        label="Max. Fingerspreiz (Bünde)"
        id="maxStretch"
        min={3}
        max={6}
        step={1}
        value={settings.maxStretch}
        onChange={handleSliderChange}
      />

      {/* Tab Range (Saiten) */}
      <SettingSlider
        label="Saiten-Bereich (von E1)"
        id="tabRange"
        min={2}
        max={6}
        step={1}
        value={settings.tabRange}
        onChange={handleSliderChange}
      />

      {/* TODO: Preset Buttons (Save/Load) */}
    </div>
  );
}

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const presetColors = [
    '#6E59A5', // Primary purple
    '#10B981', // Green
    '#1E3A8A', // Blue dark
    '#3B82F6', // Blue medium
    '#8B5CF6', // Vivid purple
    '#EC4899', // Pink
    '#F97316', // Orange
    '#EF4444', // Red
    '#000000', // Black
    '#FFFFFF', // White
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-10 h-10 rounded-md border border-input overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: color }}
          aria-label="Escolher cor"
        >
          <span className="sr-only">Escolher cor</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                className="w-6 h-6 rounded-md border border-input transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
                style={{ backgroundColor: presetColor }}
                onClick={() => {
                  onChange(presetColor);
                  setIsOpen(false);
                }}
                aria-label={`Cor ${presetColor}`}
              />
            ))}
          </div>
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-8"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

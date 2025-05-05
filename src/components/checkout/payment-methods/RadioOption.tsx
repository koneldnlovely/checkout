
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface RadioOptionProps {
  id: string;
  value: string;
  label: string;
  Icon: LucideIcon;
  iconColor: string;
  className?: string;
}

const RadioOption: React.FC<RadioOptionProps> = ({ 
  id, 
  value, 
  label, 
  Icon, 
  iconColor,
  className
}) => {
  return (
    <div className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer ${
      value === 'creditCard' || value === 'card' ? 'border-green-500 bg-green-500/10' : 
      value === 'pix' ? 'border-green-500 bg-green-500/10' : 'border-gray-600'
    } ${className}`}>
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id} className="flex items-center cursor-pointer">
        <Icon className={`h-5 w-5 mr-2 ${iconColor}`} />
        {label}
      </Label>
    </div>
  );
};

export default RadioOption;

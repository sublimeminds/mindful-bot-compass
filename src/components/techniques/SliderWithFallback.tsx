
import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface SliderWithFallbackProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  max: number;
  min: number;
  step: number;
  className?: string;
  disabled?: boolean;
}

const SliderWithFallback = ({ 
  value, 
  onValueChange, 
  max, 
  min, 
  step, 
  className,
  disabled = false
}: SliderWithFallbackProps) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset error state when props change
    setHasError(false);
  }, [value, max, min]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onValueChange([newValue]);
    }
  };

  if (hasError) {
    return (
      <div className="w-full">
        <Input
          type="number"
          value={value[0]}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={className}
        />
        <div className="text-xs text-muted-foreground mt-1">
          Using fallback input (slider unavailable)
        </div>
      </div>
    );
  }

  try {
    return (
      <Slider
        value={value}
        onValueChange={onValueChange}
        max={max}
        min={min}
        step={step}
        className={className}
        disabled={disabled}
      />
    );
  } catch (error) {
    console.error('Slider error, falling back to input:', error);
    setHasError(true);
    return (
      <Input
        type="number"
        value={value[0]}
        onChange={handleInputChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={className}
      />
    );
  }
};

export default SliderWithFallback;

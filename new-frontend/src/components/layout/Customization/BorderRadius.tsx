"use client";

import { Slider } from "@/components/ui/slider";
import { useBorderRadius } from "@/components/context/border-radius-context";

export default function BorderRadius() {
  const { borderRadius, setBorderRadius } = useBorderRadius();

  const handleChange = (value: number[]) => {
    setBorderRadius(value[0]);
  };

  return (
    <div className="pl-4 pr-6 pb-4 space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">BORDER RADIUS</h2>

      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium">4px</span>

        <Slider
          value={[borderRadius]}
          onValueChange={handleChange}
          min={4}
          max={24}
          step={1}
          className="w-full"
        />

        <span className="text-sm font-medium">24px</span>
      </div>

      <div className="text-sm text-muted-foreground">
        Selected: <span className="font-medium">{borderRadius}px</span>
      </div>
    </div>
  );
}

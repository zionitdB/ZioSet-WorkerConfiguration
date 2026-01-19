import { useFont } from "@/components/context/font-context";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const fonts = [
    { label: "Default", value: "" },
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Poppins", value: "'Poppins', sans-serif" },
  { label: "Roboto", value: "'Roboto', sans-serif" },
  { label: "Lato", value: "'Lato', sans-serif" },
  { label: "Montserrat", value: "'Montserrat', sans-serif" },
  { label: "Open Sans", value: "'Open Sans', sans-serif" },
  { label: "Nunito", value: "'Nunito', sans-serif" }
];

export default function FontFamilyPage() {
  const { font, setFont } = useFont();

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Choose Font Style</h2>
      <div className="grid gap-4">
        {fonts.map((fonts) => {
          const isActive = font === fonts.value;
          return (
            <Card
              key={fonts.label}
              onClick={() => setFont(fonts.value)}
              className={cn(
                "p-4 cursor-pointer border",
                isActive
                  ? "bg-primary/10 border-primary"
                  : "bg-muted hover:bg-muted/70"
              )}
            >
              <Label style={{ fontFamily: fonts.value }}>{fonts.label}</Label>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BaptismViewProps {
  data: Record<string, any> | null;
}

const BaptismView: React.FC<BaptismViewProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center p-10">
        <p className="text-muted-foreground text-lg font-medium">
          No record selected.
        </p>
      </div>
    );
  }
console.log(data);

  return (
    <Card className="border border-border shadow-sm bg-background">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold text-primary">
          Baptism Record Details
        </CardTitle>
      </CardHeader>

      <Separator className="mb-4" />

      <CardContent className="space-y-6">
        {/* 🔹 Child Information */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-foreground">
            Child Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <InfoItem label="Name" value={data.name} />
            <InfoItem label="Surname" value={data.surname} />
            <InfoItem label="Birth Date" value={data.birthDate} />
            <InfoItem label="Place of Birth" value={data.placeOfBirth} />
            <InfoItem label="Indian" value={data.indian} isBoolean />
          </div>
        </div>

        <Separator />

        {/* 🔹 Parents Information */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-foreground">
            Parents Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <InfoItem label="Father's Name" value={data.fatherName} />
            <InfoItem label="Mother's Name" value={data.motherName} />
            <InfoItem label="Father's Residence" value={data.fatherResidence} />
            <InfoItem label="Father's Profession" value={data.fatherProfession} />
          </div>
        </div>

        <Separator />

        {/* 🔹 Godparents Information */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-foreground">
            Godparents Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <InfoItem label="Godfather Name" value={data.godfatherName} />
            <InfoItem label="Godfather Surname" value={data.godfatherSurname} />
            <InfoItem label="Godfather Residence" value={data.godfatherResidence} />
            <InfoItem label="Godmother Name" value={data.godmotherName} />
            <InfoItem label="Godmother Surname" value={data.godmotherSurname} />
            <InfoItem label="Godmother Residence" value={data.godmotherResidence} />
          </div>
        </div>

        <Separator />

        {/* 🔹 Baptism Ceremony */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-foreground">
            Baptism Ceremony
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <InfoItem label="Date of Baptism" value={data.dateOfBaptism} />
            <InfoItem label="Place of Baptism" value={data.placeOfBaptism} />
            <InfoItem label="Minister" value={data.minister} />
            <InfoItem label="Remarks" value={data.remarks} />
            <InfoItem label="Confirmed" value={data.confirmed} isBoolean />
            <InfoItem label="Married" value={data.married} isBoolean />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 🔹 Reusable info display component
interface InfoItemProps {
  label: string;
  value: any;
  isBoolean?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, isBoolean }) => {
  let displayValue;

  if (isBoolean) {
    displayValue = (
      <Badge variant={value ? "default" : "secondary"}>
        {value ? "Yes" : "No"}
      </Badge>
    );
  } else if (value === null || value === undefined || value === "") {
    displayValue = <span className="text-muted-foreground">-</span>;
  } else {
    displayValue = (
      <span className="text-foreground font-medium wrap-break-word">
        {String(value)}
      </span>
    );
  }

  return (
    <div className="border rounded-lg p-3 bg-muted/40 hover:bg-muted/60 transition-colors">
      <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
      <div>{displayValue}</div>
    </div>
  );
};

export default BaptismView;

import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader 
} from "@/components/components/ui/card";
import { Label } from "@/components/components/ui/label";
import { Switch } from "@/components/components/ui/switch";

interface ToggleFollowFilterProps{
    followFilter: boolean;
    setFollowFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleFollowFilter:React.FC<ToggleFollowFilterProps> = ({followFilter, setFollowFilter}) => {

  const handleToggle = (checked:boolean) => {
    setFollowFilter(checked)
  }

  return (
    <Card className="flex flex-col gap-2 bg-primary text-secondary">
      <CardContent>
        <CardHeader>
          <Label>
            Follows
          </Label>
          <Switch 
            checked={followFilter}
            onCheckedChange={handleToggle}
            className="border-secondary"
          />
        </CardHeader>
      </CardContent>
    </Card>
  );
}

export default ToggleFollowFilter;
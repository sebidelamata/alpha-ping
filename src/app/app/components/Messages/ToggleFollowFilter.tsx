import React from "react";
import { useUserProviderContext } from "src/contexts/UserContext";
import { 
  Card, 
  CardContent, 
  CardHeader 
} from "@/components/components/ui/card";
import { Label } from "@/components/components/ui/label";
import { Switch } from "@/components/components/ui/switch";

const ToggleFollowFilter:React.FC = () => {

  const { followFilter, setFollowFilter } = useUserProviderContext()

  const handleToggle = (checked:boolean) => {
    setFollowFilter(checked)
  }

  return (
    <Card className="flex flex-col gap-2 bg-primary text-secondary">
      <CardContent className="flex justify-end align-bottom items-baseline">
        <CardHeader>
          <Label>
            Follows
          </Label>
          <Switch 
            checked={followFilter}
            onCheckedChange={handleToggle}
            className="border-secondary data-[state=checked]:bg-accent data-[state=checked]:border-accent"
          />
        </CardHeader>
      </CardContent>
    </Card>
  );
}

export default ToggleFollowFilter;
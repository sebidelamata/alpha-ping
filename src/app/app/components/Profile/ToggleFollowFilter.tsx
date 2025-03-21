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
    <Card className="bg-primary text-secondary">
      <CardContent className="h-4">
        <CardHeader className="relative bottom-8 flex flex-row gap-2 justify-start align-middle items-center">
          <Label className="text-lg align-middle items-center">
            Follows
          </Label>
          <Switch 
            checked={followFilter}
            onCheckedChange={handleToggle}
            className="relative data-[state=unchecked]:bg-accent  data-[state=unchecked]:border-secondary data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
          />
        </CardHeader>
      </CardContent>
    </Card>
  );
}

export default ToggleFollowFilter;
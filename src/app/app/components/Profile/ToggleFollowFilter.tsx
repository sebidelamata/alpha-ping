import React from "react";
import { useUserProviderContext } from "src/contexts/UserContext";
import { Label } from "@/components/components/ui/label";
import { Switch } from "@/components/components/ui/switch";

const ToggleFollowFilter:React.FC = () => {

  const { followFilter, setFollowFilter } = useUserProviderContext()

  const handleToggle = (checked:boolean) => {
    setFollowFilter(checked)
  }

  return (
    <div className="flex items-center gap-2">
      <Label className="text-xl items-center justify-center">
        Follows
      </Label>
      <Switch 
        checked={followFilter}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-accent"
      />
    </div>
  )
}

export default ToggleFollowFilter;
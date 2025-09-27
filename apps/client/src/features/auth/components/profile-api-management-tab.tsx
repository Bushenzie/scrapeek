import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";

export const ProfileAPIManagementTab = () => {
  return (
    <div className="flex items-start">
      <div className="flex items-center gap-2">
        <Input />
        <Button>Generate</Button>
      </div>
    </div>
  );
};

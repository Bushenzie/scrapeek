import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { DeleteAccountModal } from "./delete-account-modal";

export const ProfilePageContent = () => {
  return (
    <div>
      <div className="space-y-4 p-4">
        <div className="flex flex-col items-start gap-2">
          <h3 className="text-lg">API Key managament</h3>
          <div className="flex items-center gap-2">
            <Input />
            <Button>Generate</Button>
          </div>
        </div>
        <div className="flex flex-col items-start  gap-2">
          <h3 className="text-lg">Advanced</h3>
          <DeleteAccountModal />
        </div>
      </div>
    </div>
  );
};

import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { useCreateAPIKey } from "../api/mutations/use-create-api-key";
import { useApiKey } from "../api/queries/use-api-key";
import { useApiKeyList } from "../api/queries/use-api-key-list";

export const ProfileAPIManagementTab = () => {
  const { data: apiKeys } = useApiKeyList();

  return (
    <div className="flex items-start">
      <div className="flex items-center gap-2">
        <Input value={""} readOnly />
        {/* <Button onClick={handleApiKeyGeneration}>Generate</Button> */}
      </div>
    </div>
  );
};

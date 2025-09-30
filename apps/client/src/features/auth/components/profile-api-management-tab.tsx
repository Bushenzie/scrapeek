import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { useGenerateAPIKey } from "../api/mutations/use-generate-api-key";
import { useApiKey } from "../api/queries/use-api-key";

export const ProfileAPIManagementTab = () => {
  const { data: apiKey } = useApiKey();
  const generateApiKey = useGenerateAPIKey();

  const handleApiKeyGeneration = () => {
    generateApiKey.mutate();
  };

  return (
    <div className="flex items-start">
      <div className="flex items-center gap-2">
        <Input value={apiKey} readOnly />
        <Button onClick={handleApiKeyGeneration}>Generate</Button>
      </div>
    </div>
  );
};

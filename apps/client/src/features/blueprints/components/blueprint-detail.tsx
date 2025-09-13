import { type FC } from "react";
import { Button } from "@/components/ui/button/button";
import { CodeBlock } from "@/components/ui/code-block/code-block";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { useRunBlueprint } from "../api/mutations/use-run-blueprint";
import { useBlueprintDetail } from "../api/queries/use-blueprint-detail";

type BlueprintDetailProps = {
  blueprintId: string;
};

export const BlueprintDetail: FC<BlueprintDetailProps> = ({ blueprintId }) => {
  const { data: blueprint } = useBlueprintDetail({ blueprintId });
  const { data, mutate: runScraper } = useRunBlueprint({
    blueprintIds: [blueprintId],
  });

  const handleRunScraper = () => {
    runScraper("normal");
  };

  const handleTestRunScraper = () => {
    runScraper("test");
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 p-6">
        <div className="col-span-1">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input value={blueprint.name} readOnly />
            </div>
            <div className="flex flex-col gap-2">
              <Label>URL</Label>
              <Input value={blueprint.url} readOnly />
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex flex-col gap-2">
            <Label>Last scraper run result</Label>
            <CodeBlock
              code={JSON.stringify(
                typeof data?.[0] === "object" ? data[0] : {},
                null,
                4
              )}
              lang="json"
              theme="github-dark-dimmed"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 pb-6 pr-6 ">
        <Button variant={"outline"} onClick={handleTestRunScraper}>
          Test run
        </Button>
        <Button onClick={handleRunScraper}>Run scraper</Button>
      </div>
    </div>
  );
};

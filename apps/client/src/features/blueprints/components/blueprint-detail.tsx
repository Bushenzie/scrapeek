import { saveAs } from "file-saver";
import { type FC, useMemo } from "react";
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

  const getLastScrapedData = () => {
    const source =
      (data && Array.isArray(data) ? data[0] : data) ?? blueprint?.result?.data;

    const lastScrapedData = source ?? {};

    return JSON.stringify(lastScrapedData, null, 4);
  };

  const lastScrapedData = useMemo(
    () => getLastScrapedData(),
    [blueprint, data]
  );

  const handleDownload = () => {
    const lastScrapedData = getLastScrapedData();

    const dataBlob = new Blob([lastScrapedData], { type: "application/json" });

    saveAs(dataBlob, `${blueprint.name}_data.json`);
  };

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
            <div className="flex justify-between">
              <Label>Last scraper run result</Label>
              <Button
                variant={"link"}
                className="m-0 p-0 h-max"
                onClick={handleDownload}
              >
                Download
              </Button>
            </div>
            <CodeBlock
              code={lastScrapedData}
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

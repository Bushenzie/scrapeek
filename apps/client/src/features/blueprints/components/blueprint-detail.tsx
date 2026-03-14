import { useQuery } from "@tanstack/react-query";
import fileSaver from "file-saver";
import { Copy, Download } from "lucide-react";
import { type FC, useMemo } from "react";
import { Button } from "@/components/ui/button/button";
import { CodeBlock } from "@/components/ui/code-block/code-block";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { useRunBlueprint } from "../api/blueprints.mutations";
import { blueprintDetailOptions } from "../api/blueprints.queries";

type BlueprintDetailProps = {
  blueprintId: string;
};

export const BlueprintDetail: FC<BlueprintDetailProps> = ({ blueprintId }) => {
  const { data: blueprint } = useQuery(blueprintDetailOptions({
    param: {
      id: blueprintId
    }
  }));
  const {
    data,
    isPending,
    mutate: runScraper,
  } = useRunBlueprint();

  const resultURL = useMemo(() => {
    if (!blueprint?.result) return undefined
    return `http://localhost:3001/api/result/${blueprint?.result?.id}`;
  }, [blueprint, data]);

  const lastScrapedData = useMemo(() => {
    const source = (data && Array.isArray(data) ? data[0] : data) ?? blueprint?.result?.data;

    const lastScrapedData = source ?? {};

    return JSON.stringify(lastScrapedData, null, 4);
  }, [blueprint, data]);

  const handleDownload = () => {
    const dataBlob = new Blob([lastScrapedData], { type: "application/json" });

    fileSaver.saveAs(dataBlob, `${blueprint?.name}_data.json`);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(lastScrapedData);
  };

  const handleRunScraper = () => {
    runScraper({json: {id: blueprintId,mode: "normal"}});
  };

  const handleTestRunScraper = () => {
    runScraper({json: {id: blueprintId,mode: "test"}});
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 p-6">
        <div className="col-span-1">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input value={blueprint?.name} readOnly />
            </div>
            <div className="flex flex-col gap-2">
              <Label>URL</Label>
              <Input value={blueprint?.url} readOnly />
            </div>
          </div>
        </div>
        <div className="col-span-1 space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <h2 className="text-sm">Last scraper run result</h2>
                <span className="text-xs">{JSON.parse(lastScrapedData).length ?? 0} results</span>
              </div>
              <div className="flex gap-4">
                <Button variant={"link"} size={"icon"} className="m-0 p-0 h-max w-fit" onClick={handleDownload}>
                  <Download />
                </Button>
                <Button variant={"link"} size={"icon"} className="m-0 p-0 h-max w-fit" onClick={handleCopy}>
                  <Copy />
                </Button>
              </div>
            </div>
            <CodeBlock code={lastScrapedData} lang="json" theme="github-dark-dimmed" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Result URL</Label>
            <Input value={resultURL} readOnly />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 pb-6 pr-6 ">
        <Button variant={"outline"} onClick={handleTestRunScraper} loading={isPending}>
          Test run
        </Button>
        <Button onClick={handleRunScraper} loading={isPending}>
          Run scraper
        </Button>
      </div>
    </div>
  );
};

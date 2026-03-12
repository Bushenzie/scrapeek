import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table/table";
import { apiKeyListOptions } from "../api/auth.queries";
import { DeleteApiKeyModal } from "./modals/delete-api-key-modal";

export const ProfileAPIManagementTab = () => {
  const { data: apiKeys } = useQuery(apiKeyListOptions());

  return (
    <div className="flex items-start">
      {!apiKeys ||
        (apiKeys?.length === 0 && (
          <span className="text-blueprint-200 w-full text-center text-sm">
            No API Keys found
          </span>
        ))}
      {apiKeys && apiKeys?.length > 0 && (
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Name</TableHead>
              <TableHead className="w-[50%]">Created at</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys?.map((apiKey) => (
              <TableRow>
                <TableCell>{apiKey.name ?? "API Key"}</TableCell>
                <TableCell>
                  {format(apiKey.createdAt, "dd.MM.yyyy / HH:mm")} (
                  {formatDistanceToNow(apiKey.createdAt, { addSuffix: true })})
                </TableCell>
                <TableCell className="text-center">
                  <DeleteApiKeyModal
                    name={apiKey?.name ?? "API Key"}
                    id={apiKey.id}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

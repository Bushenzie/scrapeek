import { Suspense, useState } from "react";
import { Box } from "@/components/ui/box/box";
import { LoadingSpinner } from "@/components/ui/loading-spinner/loading-spinner";
import { Separator } from "@/components/ui/separator/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs/tabs";
import { ProfileAdvancedTab } from "@/features/auth/components/profile-advanced-tab";
import { ProfileAPIManagementTab } from "@/features/auth/components/profile-api-management-tab";
import { ProfileSettingsTab } from "@/features/auth/components/profile-settings-tab";
import { CreateApiKeyModal } from "./modals/create-api-key-modal";

type TabOptions = "settings" | "advanced" | "api-management";

export const ProfilePageContent = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tab, setTab] = useState<TabOptions>("settings");

  return (
    <Tabs
      defaultValue={tab}
      onValueChange={(val) => setTab(val as TabOptions)}
      className="grid grid-cols-4 items-start"
    >
      <Box className="col-span-1 flex items-center justify-center p-2 max-h-fit">
        <TabsList className="flex items-center flex-col gap-2 w-full h-full bg-transparent border-transparent">
          <TabsTrigger value="settings" className="w-full text-left">
            Settings
          </TabsTrigger>
          <TabsTrigger value="api-management" className="w-full">
            API Management
          </TabsTrigger>
          <TabsTrigger value="advanced" className="w-full">
            Advanced
          </TabsTrigger>
        </TabsList>
      </Box>
      <Suspense fallback={<LoadingSpinner />}>
        <Box className="col-span-3">
          <div className="flex justify-between items-center p-6">
            <h1 className="text-2xl">
              Profile | {tab.toUpperCase().split("-").join(" ")}
            </h1>
            {tab === "api-management" && (
              <CreateApiKeyModal
                isOpen={createModalOpen}
                setIsOpen={setCreateModalOpen}
              />
            )}
          </div>
          <Separator />
          <TabsContent value="settings" className="p-4">
            <ProfileSettingsTab />
          </TabsContent>
          <TabsContent value="api-management" className="p-4">
            <ProfileAPIManagementTab />
          </TabsContent>
          <TabsContent value="advanced" className="p-4">
            <ProfileAdvancedTab />
          </TabsContent>
        </Box>
      </Suspense>
    </Tabs>
  );
};

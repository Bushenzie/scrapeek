import { createFileRoute } from "@tanstack/react-router";
import { Box } from "@/components/ui/box/box";
import { Separator } from "@/components/ui/separator/separator";
import { ProfilePageContent } from "@/features/auth/components/profile-page-content";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <Box className="w-full">
      <div className="flex justify-between p-6">
        <h1 className="text-2xl">Profile</h1>
      </div>
      <Separator />
      <ProfilePageContent />
    </Box>
  );
}

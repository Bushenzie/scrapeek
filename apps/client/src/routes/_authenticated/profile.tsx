import { createFileRoute } from "@tanstack/react-router"

import { ProfilePageContent } from "@/features/auth/components/profile-page-content"

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [{ title: "Scrapeek - profile" }],
  }),
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <div className="gap-4">
      <ProfilePageContent />
    </div>
  )
}

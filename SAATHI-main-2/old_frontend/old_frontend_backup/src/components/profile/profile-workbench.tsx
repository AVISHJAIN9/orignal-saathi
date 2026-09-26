import { useState } from "react";
import { useTranslation } from "react-i18next";

import { BrandMark } from "@/components/brand-mark";
import { ProfileAccountSection } from "@/components/profile/profile-account-section";
import { ProfileActivitySection } from "@/components/profile/profile-activity-section";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileIdentitySection } from "@/components/profile/profile-identity-section";
import { ProfilePreferencesSection } from "@/components/profile/profile-preferences-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useRole } from "@/lib/role";

type ProfileTab = "identity" | "preferences" | "account" | "activity";

/**
 * Owns nothing of its own — every field on this page traces back to a
 * real source: S1's AuthProvider (`currentUser`), RoleProvider (`role`),
 * the shared `useUserProfile()` hook (cosmetic prefs, the same store
 * App.tsx and the sidebar's ProfileSettings dialog read/write), and S2's
 * `getRecentActivity` mock for the Activity tab. No second local profile
 * store, per the task this page was built from.
 */
export function ProfileWorkbench() {
  const { t } = useTranslation("profile");
  const { currentUser } = useAuth();
  const { role } = useRole();
  const { profile, setProfile, soundEnabled, setSoundEnabled } =
    useUserProfile();
  const [activeTab, setActiveTab] = useState<ProfileTab>("identity");

  if (!currentUser) return null;

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader currentUser={currentUser} profile={profile} role={role} />

      <div className="elevation-1 flex items-start gap-2 rounded-xl border border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
        <BrandMark size="sm" />
        <span className="pt-0.5">{t("disclaimer")}</span>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ProfileTab)}
      >
        <TabsList variant="line">
          <TabsTrigger value="identity">{t("tabs.identity")}</TabsTrigger>
          <TabsTrigger value="preferences">{t("tabs.preferences")}</TabsTrigger>
          <TabsTrigger value="account">{t("tabs.account")}</TabsTrigger>
          <TabsTrigger value="activity">{t("tabs.activity")}</TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="pt-4">
          <ProfileIdentitySection currentUser={currentUser} />
        </TabsContent>

        <TabsContent value="preferences" className="pt-4">
          <ProfilePreferencesSection
            profile={profile}
            soundEnabled={soundEnabled}
            onSave={setProfile}
            onSoundEnabledChange={setSoundEnabled}
          />
        </TabsContent>

        <TabsContent value="account" className="pt-4">
          <ProfileAccountSection currentUser={currentUser} role={role} />
        </TabsContent>

        <TabsContent value="activity" className="pt-4">
          <ProfileActivitySection role={role} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

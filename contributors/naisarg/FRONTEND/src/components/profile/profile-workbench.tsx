import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ProfileAccountSection } from "@/components/profile/profile-account-section";
import { ProfileActivitySection } from "@/components/profile/profile-activity-section";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileIdentitySection } from "@/components/profile/profile-identity-section";
import { ProfilePreferencesSection } from "@/components/profile/profile-preferences-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { AVATAR_SECTION_ID, useUserProfile } from "@/lib/profile";
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
  const { profile, setProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState<ProfileTab>("identity");
  const prefersReducedMotion = useReducedMotion();

  // The header avatar is a shortcut into the one avatar picker: switch to
  // Preferences, then (once it has rendered) bring the Avatar section into
  // view and put focus on its current tab. A counter, so repeat clicks
  // while already on Preferences still scroll.
  const [avatarJump, setAvatarJump] = useState(0);
  useEffect(() => {
    if (avatarJump === 0) return;
    const section = document.getElementById(AVATAR_SECTION_ID);
    if (!section) return;
    // Focus first: focusing after starting a smooth scroll cancels it.
    section
      .querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
      ?.focus({ preventScroll: true });
    section.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [avatarJump, prefersReducedMotion]);
  function handleEditAvatar() {
    setActiveTab("preferences");
    setAvatarJump((n) => n + 1);
  }

  if (!currentUser) return null;

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader
        currentUser={currentUser}
        role={role}
        onEditAvatar={handleEditAvatar}
      />

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ProfileTab)}
      >
        <div className="-mx-1 overflow-x-auto px-1">
          <TabsList variant="line" className="shrink-0">
            <TabsTrigger value="identity">{t("tabs.identity")}</TabsTrigger>
            <TabsTrigger value="preferences">
              {t("tabs.preferences")}
            </TabsTrigger>
            <TabsTrigger value="account">{t("tabs.account")}</TabsTrigger>
            <TabsTrigger value="activity">{t("tabs.activity")}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="identity" className="pt-4">
          <ProfileIdentitySection currentUser={currentUser} />
        </TabsContent>

        <TabsContent value="preferences" className="pt-4">
          <ProfilePreferencesSection profile={profile} onSave={setProfile} />
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

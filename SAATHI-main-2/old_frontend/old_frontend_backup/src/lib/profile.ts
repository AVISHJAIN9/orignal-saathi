export type ProfileTone = "navy" | "sage" | "clay";

export interface UserProfile {
  displayName: string;
  focus: string;
  tone: ProfileTone;
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  displayName: "Standards explorer",
  focus: "BIS navigator",
  tone: "navy",
};

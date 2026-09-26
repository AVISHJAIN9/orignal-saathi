import {
  Bird,
  Cat,
  Dog,
  Ghost,
  Leaf,
  Rabbit,
  Rocket,
  Star,
  type LucideIcon,
} from "lucide-react";

export interface AvatarCharacter {
  id: string;
  icon: LucideIcon;
  bgClassName: string;
}

// A preset, illustration-free "pick a character" option for users who don't
// want to upload a real photo — fixed saturated colours (like the tone
// swatches in lib/profile.ts) so each stays legible in both themes without
// per-theme variants.
export const AVATAR_CHARACTERS: AvatarCharacter[] = [
  { id: "cat", icon: Cat, bgClassName: "bg-orange-500" },
  { id: "dog", icon: Dog, bgClassName: "bg-amber-600" },
  { id: "rabbit", icon: Rabbit, bgClassName: "bg-pink-500" },
  { id: "bird", icon: Bird, bgClassName: "bg-sky-500" },
  { id: "ghost", icon: Ghost, bgClassName: "bg-violet-500" },
  { id: "rocket", icon: Rocket, bgClassName: "bg-indigo-500" },
  { id: "star", icon: Star, bgClassName: "bg-yellow-500" },
  { id: "leaf", icon: Leaf, bgClassName: "bg-emerald-500" },
];

export function getAvatarCharacter(
  id: string | undefined,
): AvatarCharacter | undefined {
  return AVATAR_CHARACTERS.find((character) => character.id === id);
}

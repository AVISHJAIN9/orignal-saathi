import { Camera, Image as ImageIcon, Smile, Trash2, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { AVATAR_CHARACTERS } from "@/lib/avatar-characters";
import {
  AvatarImageError,
  captureVideoFrameSquare,
  processAvatarImageFile,
} from "@/lib/avatar-image";
import type { ProfileTone } from "@/lib/profile";
import { cn } from "@/lib/utils";

export interface AvatarSelection {
  avatarDataUrl?: string | null;
  avatarCharacter?: string | null;
}

interface AvatarUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatarDataUrl?: string;
  currentAvatarCharacter?: string;
  tone: ProfileTone;
  name: string;
  onSave: (selection: AvatarSelection) => void;
  /** Hide the menu's "Pick a character" entry — the Avatar section's
   * Photo tab uses this dialog for photos only, since characters have
   * their own tab there. */
  showCharacterOption?: boolean;
}

type Mode = "menu" | "camera" | "preview" | "characters";

/**
 * The one "change photo" flow, opened from both the /profile header avatar
 * and the Preferences tab's avatar row (see CosmeticPreferencesForm). Every
 * photo path — mobile camera-capture input, desktop live webcam, or a plain
 * file picker — funnels through the same centre-crop/downscale pipeline in
 * lib/avatar-image.ts before landing in a preview step, so what gets saved
 * is always already validated and small enough for localStorage. A preset
 * illustrated character (lib/avatar-characters.ts) is offered as a fourth,
 * upload-free option; picking one clears any saved photo and vice versa —
 * see UserAvatar's priority order (photo, then character, then initials).
 *
 * There is no backend in this prototype: a chosen photo is a data URL kept
 * only in this browser's localStorage (see UserProfileProvider), never
 * uploaded anywhere — the dialog copy says so explicitly.
 */
export function AvatarUploadDialog({
  open,
  onOpenChange,
  currentAvatarDataUrl,
  currentAvatarCharacter,
  tone,
  name,
  onSave,
  showCharacterOption = true,
}: AvatarUploadDialogProps) {
  const { t } = useTranslation("chat");
  const [mode, setMode] = useState<Mode>("menu");
  const [pendingDataUrl, setPendingDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function stopCameraStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function resetAndClose() {
    stopCameraStream();
    setMode("menu");
    setPendingDataUrl(null);
    setError(null);
    onOpenChange(false);
  }

  // Belt-and-suspenders: stop the webcam if the dialog is closed by any
  // other means (Escape, overlay click, the built-in close button).
  useEffect(() => {
    if (!open) stopCameraStream();
  }, [open]);
  useEffect(() => stopCameraStream, []);

  async function handleUseCamera() {
    setError(null);
    setIsStartingCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      setMode("camera");
      // The <video> element only exists once `mode` re-renders to "camera",
      // so attach the stream on the next tick rather than before this state
      // update has committed.
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    } catch (err) {
      const errorName = err instanceof DOMException ? err.name : "";
      setError(
        errorName === "NotAllowedError" || errorName === "PermissionDeniedError"
          ? t(
              "profile.avatar.cameraPermissionDenied",
              "Camera access was denied. Choose a photo from your files instead.",
            )
          : t(
              "profile.avatar.cameraUnavailable",
              "No camera was found on this device. Choose a photo from your files instead.",
            ),
      );
    } finally {
      setIsStartingCamera(false);
    }
  }

  function handleCapture() {
    if (!videoRef.current) return;
    const dataUrl = captureVideoFrameSquare(videoRef.current);
    stopCameraStream();
    setPendingDataUrl(dataUrl);
    setMode("preview");
  }

  async function handleFileSelected(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);
    try {
      const dataUrl = await processAvatarImageFile(file);
      setPendingDataUrl(dataUrl);
      setMode("preview");
    } catch (err) {
      if (err instanceof AvatarImageError && err.code === "invalid-type") {
        setError(
          t(
            "profile.avatar.invalidFileType",
            "Please choose a JPEG, PNG, or WEBP image.",
          ),
        );
      } else if (err instanceof AvatarImageError && err.code === "too-large") {
        setError(
          t(
            "profile.avatar.fileTooLarge",
            "That image is too large — please choose one under 8 MB.",
          ),
        );
      } else {
        setError(
          t(
            "profile.avatar.processingError",
            "Something went wrong reading that image. Please try another one.",
          ),
        );
      }
    }
  }

  function handleUsePhoto() {
    if (!pendingDataUrl) return;
    onSave({ avatarDataUrl: pendingDataUrl, avatarCharacter: null });
    resetAndClose();
  }

  function handleSelectCharacter(characterId: string) {
    onSave({ avatarCharacter: characterId, avatarDataUrl: null });
    resetAndClose();
  }

  function handleRemove() {
    onSave({ avatarDataUrl: null, avatarCharacter: null });
    resetAndClose();
  }

  const hasCurrentSelection = Boolean(
    currentAvatarDataUrl || currentAvatarCharacter,
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetAndClose();
        else onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {t("profile.avatar.dialogTitle", "Update your photo")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "profile.avatar.dialogDescription",
              "Stored on this device only — there is no server to upload it to.",
            )}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
          >
            {error}
          </p>
        )}

        {mode === "menu" && (
          <div className="flex flex-col items-center gap-4 py-2">
            <UserAvatar
              size="lg"
              name={name}
              tone={tone}
              avatarDataUrl={currentAvatarDataUrl ?? null}
              avatarCharacter={currentAvatarCharacter ?? null}
            />
            <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => captureInputRef.current?.click()}
              >
                <Camera className="size-4" aria-hidden />
                {t("profile.avatar.takePhoto", "Take photo")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={handleUseCamera}
                disabled={isStartingCamera}
              >
                <Video className="size-4" aria-hidden />
                {isStartingCamera
                  ? t("profile.avatar.cameraStarting", "Starting camera…")
                  : t("profile.avatar.useCamera", "Use webcam")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="size-4" aria-hidden />
                {t("profile.avatar.chooseFile", "Choose from files")}
              </Button>
              {showCharacterOption && (
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setMode("characters")}
                >
                  <Smile className="size-4" aria-hidden />
                  {t("profile.avatar.chooseCharacter", "Pick a character")}
                </Button>
              )}
              {hasCurrentSelection && (
                <Button
                  type="button"
                  variant="ghost"
                  className="gap-2 text-destructive hover:text-destructive sm:col-span-2"
                  onClick={handleRemove}
                >
                  <Trash2 className="size-4" aria-hidden />
                  {t("profile.avatar.removePhoto", "Remove photo")}
                </Button>
              )}
            </div>
            <p className="text-center text-2xs text-muted-foreground">
              {t(
                "profile.avatar.deviceOnlyNotice",
                "This photo is stored only on this device — there is no account backup.",
              )}
            </p>
          </div>
        )}

        {mode === "characters" && (
          <div className="flex flex-col gap-3 py-2">
            <div
              className="grid grid-cols-4 gap-2"
              role="listbox"
              aria-label={t(
                "profile.avatar.chooseCharacter",
                "Pick a character",
              )}
            >
              {AVATAR_CHARACTERS.map((character) => (
                <button
                  key={character.id}
                  type="button"
                  role="option"
                  aria-selected={currentAvatarCharacter === character.id}
                  onClick={() => handleSelectCharacter(character.id)}
                  aria-label={t(
                    "profile.avatar.characterLabel",
                    `${character.id} avatar`,
                    {
                      character: character.id,
                    },
                  )}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-2xl text-foreground transition-transform hover:-translate-y-0.5",
                    character.bgClassName,
                    currentAvatarCharacter === character.id &&
                      "ring-2 ring-primary/50 ring-offset-2 ring-offset-popover",
                  )}
                >
                  <character.icon className="size-1/2" aria-hidden />
                </button>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setMode("menu")}
            >
              {t("chat:profile.cancel")}
            </Button>
          </div>
        )}

        {mode === "camera" && (
          <div className="flex flex-col items-center gap-3 py-2">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              aria-label={t(
                "profile.avatar.cameraPreviewLabel",
                "Live camera preview",
              )}
              className="aspect-square w-48 rounded-2xl bg-muted object-cover"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  stopCameraStream();
                  setMode("menu");
                }}
              >
                {t("chat:profile.cancel")}
              </Button>
              <Button type="button" onClick={handleCapture} className="gap-2">
                <Camera className="size-4" aria-hidden />
                {t("profile.avatar.capture", "Capture")}
              </Button>
            </div>
          </div>
        )}

        {mode === "preview" && pendingDataUrl && (
          <div className="flex flex-col items-center gap-3 py-2">
            <img
              src={pendingDataUrl}
              alt={t("profile.avatar.previewAlt", "New profile photo preview")}
              className="size-32 rounded-2xl object-cover ring-1 ring-border"
            />
          </div>
        )}

        <input
          ref={captureInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleFileSelected}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileSelected}
        />

        {mode === "preview" && (
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setMode("menu")}
            >
              {t("profile.avatar.chooseDifferent", "Choose a different photo")}
            </Button>
            <Button type="button" onClick={handleUsePhoto}>
              {t("profile.avatar.usePhoto", "Use photo")}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

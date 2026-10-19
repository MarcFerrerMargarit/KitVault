"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Camera, Check, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { prepareAvatar } from "@/lib/image";
import { AVATAR_PREFIX, PROFILE_LIMITS, initialsFor } from "@/lib/profile";
import { setAvatar, updateProfile } from "@/app/profile/actions";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SuggestInput } from "@/components/ui/suggest-input";
import { Textarea } from "@/components/ui/textarea";
import { fill } from "@/lib/i18n/format";
import { useI18n } from "@/components/I18nProvider";

interface ProfileFormProps {
  userId: string;
  email: string;
  displayName: string | null;
  bio: string | null;
  favouriteTeam: string | null;
  avatarUrl: string | null;
  hasAvatar: boolean;
  /** Teams already in the collection, offered as favourite-team suggestions. */
  teams: string[];
}

export function ProfileForm(props: ProfileFormProps) {
  const { t } = useI18n();
  const router = useRouter();
  const fileRef = React.useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = React.useState(props.displayName ?? "");
  const [favouriteTeam, setFavouriteTeam] = React.useState(
    props.favouriteTeam ?? "",
  );
  const [bio, setBio] = React.useState(props.bio ?? "");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [photoBusy, setPhotoBusy] = React.useState(false);
  /** Shown straight away after picking, before the server round trip. */
  const [preview, setPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const dirty =
    displayName !== (props.displayName ?? "") ||
    favouriteTeam !== (props.favouriteTeam ?? "") ||
    bio !== (props.bio ?? "");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (saving || !dirty) return;
    setSaving(true);
    setError(null);
    const res = await updateProfile({ displayName, bio, favouriteTeam });
    setSaving(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setSaved(true);
    router.refresh();
  }

  async function handlePick(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    setPhotoBusy(true);
    setError(null);
    try {
      const avatar = await prepareAvatar(file);
      setPreview(URL.createObjectURL(avatar));

      const path = `${props.userId}/${AVATAR_PREFIX}${crypto.randomUUID()}.jpg`;
      const { error: upErr } = await createClient()
        .storage.from("shirts")
        .upload(path, avatar, { contentType: "image/jpeg", upsert: false });
      if (upErr) throw new Error(upErr.message);

      const res = await setAvatar(path);
      if (res.error) throw new Error(res.error);
      router.refresh();
    } catch (e) {
      setPreview(null);
      setError(
        fill(t.errors.avatarUpload, {
          error: e instanceof Error ? e.message : String(e),
        }),
      );
    } finally {
      setPhotoBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleRemovePhoto() {
    setPhotoBusy(true);
    setError(null);
    const res = await setAvatar(null);
    setPhotoBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setPreview(null);
    router.refresh();
  }

  const shownPhoto = preview ?? props.avatarUrl;
  const initials = initialsFor(displayName || props.displayName, props.email);

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Photo */}
      <div className="flex items-center gap-5">
        <Avatar
          fallback={initials}
          src={shownPhoto}
          className="h-24 w-24 text-2xl"
        />
        <div className="space-y-2">
          <p className="text-sm font-medium text-ink">{t.profile.photo}</p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={photoBusy}
              onClick={() => fileRef.current?.click()}
            >
              {photoBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              {photoBusy
                ? t.profile.uploading
                : shownPhoto
                  ? t.profile.changePhoto
                  : t.profile.addPhoto}
            </Button>
            {props.hasAvatar && !photoBusy && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemovePhoto}
              >
                <Trash2 className="h-4 w-4" />
                {t.profile.removePhoto}
              </Button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handlePick(e.target.files?.[0])}
          />
        </div>
      </div>

      {/* Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="profile-name">{t.profile.displayName}</Label>
          <Input
            id="profile-name"
            value={displayName}
            maxLength={PROFILE_LIMITS.displayName}
            placeholder={t.profile.displayNamePlaceholder}
            onChange={(e) => {
              setDisplayName(e.target.value);
              setSaved(false);
            }}
          />
        </div>
        <div>
          <Label htmlFor="profile-team">{t.profile.favouriteTeam}</Label>
          <SuggestInput
            id="profile-team"
            options={props.teams}
            value={favouriteTeam}
            maxLength={PROFILE_LIMITS.favouriteTeam}
            placeholder={t.profile.favouriteTeamPlaceholder}
            onChange={(e) => {
              setFavouriteTeam(e.target.value);
              setSaved(false);
            }}
          />
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <Label htmlFor="profile-bio">{t.profile.bio}</Label>
          <span className="text-xs tabular-nums text-muted-2">
            {fill(t.profile.charsLeft, {
              count: PROFILE_LIMITS.bio - bio.length,
            })}
          </span>
        </div>
        <Textarea
          id="profile-bio"
          value={bio}
          maxLength={PROFILE_LIMITS.bio}
          placeholder={t.profile.bioPlaceholder}
          className="min-h-[96px]"
          onChange={(e) => {
            setBio(e.target.value);
            setSaved(false);
          }}
        />
      </div>

      {error && (
        <p className="rounded-[var(--radius)] border border-danger/40 bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={!dirty || saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? t.profile.saving : t.profile.save}
        </Button>
        {saved && !dirty && (
          <span className="inline-flex items-center gap-1.5 text-sm text-accent">
            <Check className="h-4 w-4" />
            {t.profile.saved}
          </span>
        )}
      </div>
    </form>
  );
}

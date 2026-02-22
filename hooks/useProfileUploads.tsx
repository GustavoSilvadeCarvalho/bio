"use client";

import { useState } from "react";
import getSupabaseClient from "../lib/supabaseClient";
import { uploadUserImageUpsert } from "../lib/storage";
import type { Profile } from "../lib/types";

interface UploadDeps {
  profile?: Profile | null;
  currentUser?: { id?: string; token?: string } | null;
  username: string;
  setDraftAvatarUrl?: (v: string | null) => void;
  setDraftPageImage?: (v: string | null) => void;
  setError?: (v: string | null) => void;
}

export default function useProfileUploads() {
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [bgUploading, setBgUploading] = useState(false);

  async function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>, deps: UploadDeps) {
    const f = e.target.files?.[0];
    if (!f) return;
    const NEXT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const NEXT_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!NEXT_URL || !NEXT_KEY) {
      deps.setError?.('Supabase client not configured for uploads');
      return;
    }
    try {
      const isGif = f.type === 'image/gif' || f.name.toLowerCase().endsWith('.gif');
      const isMp4 = f.type === 'video/mp4' || f.name.toLowerCase().endsWith('.mp4');
      const isWebm = f.type === 'video/webm' || f.name.toLowerCase().endsWith('.webm');
      if (isGif || isMp4 || isWebm) {
        if (!deps.profile?.is_premium) {
          deps.setError?.('GIFs e vídeos (MP4/WebM) são exclusivos para usuários Premium');
          return;
        }
      }
      if (!f.type.startsWith('image/') && !isMp4 && !isWebm) {
        deps.setError?.('Arquivo não é uma imagem');
        return;
      }
      const MAX_MB = 8;
      if (f.size > MAX_MB * 1024 * 1024) {
        deps.setError?.(`Arquivo muito grande (max ${MAX_MB}MB)`);
        return;
      }

      setAvatarUploading(true);
      try {
        const sb = getSupabaseClient();
        const userIdForPath = String(deps.currentUser?.id ?? deps.username);
        const result = await uploadUserImageUpsert(sb, 'avatars', userIdForPath, f, 'avatar');
        deps.setDraftAvatarUrl?.(result.publicUrl ? `${result.publicUrl}?t=${Date.now()}` : null);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        deps.setError?.(msg);
      } finally {
        setAvatarUploading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      deps.setError?.(msg);
    }
  }

  async function handleBgFileChange(e: React.ChangeEvent<HTMLInputElement>, deps: UploadDeps) {
    const f = e.target.files?.[0];
    if (!f) return;
    const NEXT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const NEXT_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!NEXT_URL || !NEXT_KEY) {
      deps.setError?.('Supabase client not configured for uploads');
      return;
    }
    try {
      const isGif = f.type === 'image/gif' || f.name.toLowerCase().endsWith('.gif');
      const isMp4 = f.type === 'video/mp4' || f.name.toLowerCase().endsWith('.mp4');
      const isWebm = f.type === 'video/webm' || f.name.toLowerCase().endsWith('.webm');
      if ((isGif || isMp4 || isWebm) && !deps.profile?.is_premium) {
        deps.setError?.('GIFs e vídeos (MP4/WebM) são exclusivos para usuários Premium');
        return;
      }
      if (!f.type.startsWith('image/') && !f.type.startsWith('video/')) {
        deps.setError?.('Arquivo não é uma imagem ou vídeo');
        return;
      }
      const MAX_MB = 16;
      if (f.size > MAX_MB * 1024 * 1024) {
        deps.setError?.(`Arquivo muito grande (max ${MAX_MB}MB)`);
        return;
      }

      setBgUploading(true);
      try {
        const sb = getSupabaseClient();
        const userIdForPath = String(deps.currentUser?.id ?? deps.username);
        const result = await uploadUserImageUpsert(sb, 'backgrounds', userIdForPath, f, 'background');
        deps.setDraftPageImage?.(result.publicUrl ? `${result.publicUrl}?t=${Date.now()}` : null);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        deps.setError?.(msg);
      } finally {
        setBgUploading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      deps.setError?.(msg);
    }
  }

  return {
    avatarUploading,
    bgUploading,
    handleAvatarFileChange,
    handleBgFileChange,
  } as const;
}

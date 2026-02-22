"use client";

import { useEffect, useState } from "react";
import type { Profile } from "../lib/types";

export default function useProfileData(username: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [views, setViews] = useState<number>(() => 777);

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/profiles/${username}`);
        if (!res.ok) {
          if (res.status === 404) {
            if (!mounted) return;
            setProfile(null);
            setError("Profile not found");
          } else {
            if (!mounted) return;
            setError(`Failed to load profile: ${res.status}`);
          }
          return;
        }
        const data = (await res.json()) as Profile;
        if (mounted) {
          setProfile(data);
          setViews((v) => v + 1);
        }
      } catch (err: unknown) {
        if (mounted) setError(String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadProfile();
    return () => {
      mounted = false;
    };
  }, [username]);

  return {
    profile,
    setProfile,
    loading,
    error,
    setError,
    views,
    setViews,
  } as const;
}

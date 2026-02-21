import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Upload user image using no-extension + upsert (recommended).
 * Saves to `${userId}_${kind}` and relies on `upsert: true` to replace previous file.
 */
export async function uploadUserImageUpsert(
  supabase: SupabaseClient,
  bucket: string,
  userId: string,
  file: File | Blob | Buffer,
  kind: "avatar" | "background",
  makeSignedUrlSeconds?: number,
): Promise<{ path: string; publicUrl?: string; signedUrl?: string }> {
  const path = `${userId}_${kind}`; // no extension

  // try to infer content type from File/Blob
  let contentType: string | undefined = undefined;
  try {
    if (typeof (file as File).type === "string")
      contentType = (file as File).type || undefined;
  } catch (_e) {
    /* ignore */
  }

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file as any, { upsert: true, contentType });
  if (uploadError) throw uploadError;

  const publicRes = supabase.storage.from(bucket).getPublicUrl(uploadData.path);
  const result: { path: string; publicUrl?: string; signedUrl?: string } = {
    path: uploadData.path,
    publicUrl: publicRes?.data?.publicUrl,
  };

  if (makeSignedUrlSeconds && makeSignedUrlSeconds > 0) {
    const { data: signedData, error: signedErr } = await supabase.storage
      .from(bucket)
      .createSignedUrl(uploadData.path, makeSignedUrlSeconds);
    if (signedErr) throw signedErr;
    result.signedUrl = signedData.signedUrl;
  }

  return result;
}

/**
 * Alternative: keep extension in filename. This lists any existing files that begin with
 * `${userId}_${kind}` and removes them (except the new one), then uploads the new file
 * using the derived extension from `originalFilename` (preferred for keeping extension).
 *
 * Note: for Buffer uploads you should pass `originalFilename` or `contentType`.
 */
export async function uploadUserImageReplace(
  supabase: SupabaseClient,
  bucket: string,
  userId: string,
  file: File | Blob | Buffer,
  kind: "avatar" | "background",
  originalFilename?: string,
  makeSignedUrlSeconds?: number,
): Promise<{ path: string; publicUrl?: string; signedUrl?: string }> {
  // derive extension from originalFilename if present
  let ext = "";
  if (originalFilename) {
    const idx = originalFilename.lastIndexOf(".");
    if (idx !== -1) ext = originalFilename.slice(idx); // includes dot
  } else {
    // try to get from File.type (rare)
    try {
      const t = (file as File).type;
      if (t) {
        // crude map for common types
        if (t === "image/jpeg") ext = ".jpg";
        else if (t === "image/png") ext = ".png";
        else if (t === "image/gif") ext = ".gif";
        else if (t === "image/webp") ext = ".webp";
      }
    } catch (_e) {
      /* ignore */
    }
  }

  const newPath = `${userId}_${kind}${ext}`;

  // list any files that start with `${userId}_${kind}` and remove them (except newPath)
  const { data: listData, error: listErr } = await supabase.storage
    .from(bucket)
    .list(userId ? `${userId}_${kind}` : "", { limit: 100 });
  if (listErr) throw listErr;

  const toDelete = (listData || [])
    .map((it) => it.name)
    .filter((name) => name && name !== newPath);

  if (toDelete.length > 0) {
    const { error: delErr } = await supabase.storage
      .from(bucket)
      .remove(toDelete);
    if (delErr) throw delErr;
  }

  // try to infer content type
  let contentType: string | undefined = undefined;
  try {
    if (typeof (file as File).type === "string")
      contentType = (file as File).type || undefined;
  } catch (_e) {
    /* ignore */
  }

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(newPath, file as any, { upsert: false, contentType });

  if (uploadError) throw uploadError;

  const publicRes = supabase.storage.from(bucket).getPublicUrl(uploadData.path);
  const result: { path: string; publicUrl?: string; signedUrl?: string } = {
    path: uploadData.path,
    publicUrl: publicRes?.data?.publicUrl,
  };

  if (makeSignedUrlSeconds && makeSignedUrlSeconds > 0) {
    const { data: signedData, error: signedErr } = await supabase.storage
      .from(bucket)
      .createSignedUrl(uploadData.path, makeSignedUrlSeconds);
    if (signedErr) throw signedErr;
    result.signedUrl = signedData.signedUrl;
  }

  return result;
}

export default {
  uploadUserImageUpsert,
  uploadUserImageReplace,
};

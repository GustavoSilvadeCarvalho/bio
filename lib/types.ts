export type Link = { platform: string; url: string };

export type CardItem = {
  icon?: string;
  title?: string;
  subtitle?: string;
  url?: string;
};

export type ProfileSettings = {
  page_background_color?: string | null;
  page_background_image?: string | null;
  music_card_color?: string | null;
  music_card_glass?: boolean | null;
  music_card_opacity?: number | null;
  music_url?: string | null;
  mouse_particles?: boolean | null;
  mouse_particles_color?: string | null;
  mouse_particles_count?: number | null;
  mouse_particles_size?: number | null;
  mouse_particles_life?: number | null;
  tilt_strength?: number | null;
  card_opacity?: number | null;
  card_glass?: boolean | null;
  card_links?: CardItem[] | null;
  music_enabled?: boolean | null;
  show_music_card?: boolean | null;
  [k: string]: unknown;
};

export type Profile = {
  owner_id?: string | null;
  id?: string;
  username?: string;
  full_name?: string | null;
  description?: string | null;
  avatar_url?: string | null;
  background_color?: string | null;
  theme?: string | null;
  links?: Link[] | Record<string, string> | null;
  music_url?: string | null;
  views?: number | null;
  settings?: ProfileSettings | null;
  is_premium?: boolean | null;
  updated_at?: string | null;
};

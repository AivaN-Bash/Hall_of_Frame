export type Tier = "S" | "A" | "B" | "C";

export interface SiteSettings {
  siteName: string;
  greeting: string;
  heroName: string;
  heroBio: string;
  portraitUrl: string;
  aboutBio: string;
  aboutPurpose: string;
  currentlyWatchingPlaying: string;
  entryCount: number;
}

export interface CategoryEntryPreview {
  id: number;
  title: string;
  slug: string;
  releaseYear: number | null;
  posterUrl: string | null;
  tier: Tier;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  artSeed: number;
  entryCount: number;
  entries: CategoryEntryPreview[];
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface EntrySummary {
  id: number;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  title: string;
  slug: string;
  releaseYear: number | null;
  posterUrl: string | null;
  accentColor: string | null;
  tagline: string | null;
  rating: number | null;
  tier: Tier;
  featured: boolean;
  rankOrder: number;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface EntryNavItem {
  title: string;
  slug: string;
}

export interface EntryDetail extends EntrySummary {
  whyHooked: string;
  favoriteMoment: string | null;
  favoriteQuoteOrChar: string | null;
  previousEntry: EntryNavItem | null;
  nextEntry: EntryNavItem | null;
  relatedEntries: EntrySummary[];
}

export interface UserInfo {
  username: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: UserInfo;
}

export interface UploadedFile {
  filename: string;
  url: string;
  contentType: string;
  size: number;
}

export interface UpsertEntryInput {
  categoryId: number;
  title: string;
  releaseYear: number | null;
  posterUrl: string | null;
  accentColor: string | null;
  tagline: string | null;
  rating: number | null;
  tier: Tier;
  whyHooked: string;
  favoriteMoment: string | null;
  favoriteQuoteOrChar: string | null;
  featured: boolean;
  rankOrder: number;
  tags: string[];
}

export interface CategoryInput {
  name: string;
  sortOrder?: number | null;
  artSeed?: number | null;
}

export interface UpdateSiteInput {
  siteName: string;
  greeting: string;
  heroName: string;
  heroBio: string;
  portraitUrl: string;
  aboutBio: string;
  aboutPurpose: string;
  currentlyWatchingPlaying: string;
}

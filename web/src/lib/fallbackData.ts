import type { Category, EntryDetail, EntrySummary, SiteSettings } from "./types";

const NOW = "2026-11-26T00:00:00Z";

export const FALLBACK_ENTRIES: EntryDetail[] = [
  {
    id: 1,
    categoryId: 1,
    categoryName: "Series",
    categorySlug: "series",
    title: "DARK",
    slug: "dark",
    releaseYear: 2017,
    posterUrl: "/pics/dark.jpg",
    accentColor: "#e0a82e",
    tagline: "A puzzle-box family mystery set in a quiet rain-soaked forest town across connected eras.",
    rating: 9.8,
    tier: "S",
    whyHooked:
      "Few shows respect the viewer's memory the way DARK does. Every detail planted in the first hour loops back seasons later with emotional weight rather than empty shock value. The score, rain-drenched cinematography, and patient pacing turn intricate time-loop mechanics into a deeply human tragedy.",
    favoriteMoment:
      "The quiet realization across parallel timelines in the final cycle, when every seemingly separate family thread locks together.",
    favoriteQuoteOrChar: "Jonas Kahnwald — calm curiosity carrying an impossible burden.",
    featured: true,
    rankOrder: 1,
    tags: [
      { id: 1, name: "mystery", slug: "mystery" },
      { id: 2, name: "sci-fi", slug: "sci-fi" },
      { id: 3, name: "time-loop", slug: "time-loop" },
      { id: 4, name: "slow-burn", slug: "slow-burn" },
    ],
    previousEntry: null,
    nextEntry: { title: "The Queen's Gambit", slug: "the-queen-s-gambit" },
    relatedEntries: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 2,
    categoryId: 1,
    categoryName: "Series",
    categorySlug: "series",
    title: "The Queen's Gambit",
    slug: "the-queen-s-gambit",
    releaseYear: 2020,
    posterUrl: "/pics/queens-gambit.jpg",
    accentColor: "#c8c6be",
    tagline: "An orphan prodigy turns sixty-four squares into a battlefield of obsession and grace.",
    rating: 9.3,
    tier: "S",
    whyHooked:
      "Every chess match feels like a high-stakes duel even if you barely know the openings. The wardrobe, mid-century production design, and Beth Harmon's quiet intensity make every quiet room electric.",
    favoriteMoment: "Looking up at the ceiling in Moscow as the final endgame clicks into place.",
    favoriteQuoteOrChar: "Beth Harmon — sharp, guarded, and endlessly compelling.",
    featured: true,
    rankOrder: 2,
    tags: [
      { id: 5, name: "drama", slug: "drama" },
      { id: 6, name: "coming-of-age", slug: "coming-of-age" },
    ],
    previousEntry: { title: "DARK", slug: "dark" },
    nextEntry: null,
    relatedEntries: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 3,
    categoryId: 2,
    categoryName: "Films",
    categorySlug: "films",
    title: "Catch Me If You Can",
    slug: "catch-me-if-you-can",
    releaseYear: 2002,
    posterUrl: "/pics/catch-me-if-you-can.jpg",
    accentColor: "#e0a82e",
    tagline: "A breezy cat-and-mouse chase built on charm, loneliness, and forged checks.",
    rating: 9.2,
    tier: "S",
    whyHooked:
      "Spielberg directs it with effortless momentum, yet underneath the caper is a surprisingly tender story about a kid trying to outrun a broken home. The cat-and-mouse dynamic between Frank and Carl never gets old.",
    favoriteMoment: "The Christmas Eve phone call where pursuit turns into the only family either of them has.",
    favoriteQuoteOrChar: "Carl Hanratty — weary persistence hiding genuine care.",
    featured: true,
    rankOrder: 1,
    tags: [
      { id: 5, name: "drama", slug: "drama" },
      { id: 7, name: "crime", slug: "crime" },
    ],
    previousEntry: null,
    nextEntry: null,
    relatedEntries: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 4,
    categoryId: 3,
    categoryName: "Anime",
    categorySlug: "anime",
    title: "Frieren: Beyond Journey's End",
    slug: "frieren-beyond-journey-s-end",
    releaseYear: 2023,
    posterUrl: "/pics/frieren.jpg",
    accentColor: "#e6e4dd",
    tagline: "What happens after the grand quest ends, measured in decades and small memories.",
    rating: 9.6,
    tier: "S",
    whyHooked:
      "Instead of rushing toward the next boss battle, it lingers on changing seasons, half-remembered kindnesses, and learning to notice people while they are still here.",
    favoriteMoment: "The quiet meteor shower seen decades later with new companions.",
    favoriteQuoteOrChar: "Frieren — centuries of quiet reflection distilled into gentle curiosity.",
    featured: true,
    rankOrder: 1,
    tags: [
      { id: 8, name: "fantasy", slug: "fantasy" },
      { id: 4, name: "slow-burn", slug: "slow-burn" },
      { id: 9, name: "anime", slug: "anime" },
    ],
    previousEntry: null,
    nextEntry: { title: "Made in Abyss", slug: "made-in-abyss" },
    relatedEntries: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 5,
    categoryId: 3,
    categoryName: "Anime",
    categorySlug: "anime",
    title: "Made in Abyss",
    slug: "made-in-abyss",
    releaseYear: 2017,
    posterUrl: "/pics/made-in-abyss.jpg",
    accentColor: "#929994",
    tagline: "A luminous, terrifying descent into an uncharted vertical world.",
    rating: 9.4,
    tier: "S",
    whyHooked:
      "Kevin Penkin's score and the breathtaking painted backgrounds draw you into a fairy-tale expedition, before the Abyss reveals how merciless and unforgettable its depths really are.",
    favoriteMoment: "Descending through the Sea of Corpses as the music swells over the abyssal horizon.",
    favoriteQuoteOrChar: "Nanachi — carrying grief with quiet resilience.",
    featured: false,
    rankOrder: 2,
    tags: [
      { id: 8, name: "fantasy", slug: "fantasy" },
      { id: 1, name: "mystery", slug: "mystery" },
      { id: 9, name: "anime", slug: "anime" },
    ],
    previousEntry: { title: "Frieren: Beyond Journey's End", slug: "frieren-beyond-journey-s-end" },
    nextEntry: { title: "Vinland Saga", slug: "vinland-saga" },
    relatedEntries: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 6,
    categoryId: 3,
    categoryName: "Anime",
    categorySlug: "anime",
    title: "Vinland Saga",
    slug: "vinland-saga",
    releaseYear: 2019,
    posterUrl: "/pics/vinland-saga.jpg",
    accentColor: "#c8c6be",
    tagline: "A story about vengeance that grows into a meditation on peace and redemption.",
    rating: 9.5,
    tier: "S",
    whyHooked:
      "Watching Thorfinn's transformation from consumed by rage to asking what it truly means to be a warrior is one of the most earned character arcs in any medium.",
    favoriteMoment: "Thorfinn declaring he has no enemies.",
    favoriteQuoteOrChar: "Askeladd — cynical, brilliant, and tragic to the very end.",
    featured: true,
    rankOrder: 3,
    tags: [
      { id: 5, name: "drama", slug: "drama" },
      { id: 9, name: "anime", slug: "anime" },
    ],
    previousEntry: { title: "Made in Abyss", slug: "made-in-abyss" },
    nextEntry: null,
    relatedEntries: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 7,
    categoryId: 4,
    categoryName: "Games",
    categorySlug: "games",
    title: "Metaphor: ReFantazio",
    slug: "metaphor-refantazio",
    releaseYear: 2024,
    posterUrl: "/pics/metaphor.jpg",
    accentColor: "#e0a82e",
    tagline: "A royal tournament across a fractured fantasy realm driven by ideals and style.",
    rating: 9.5,
    tier: "S",
    whyHooked:
      "Every menu, battle transition, and road-trip camp scene bursts with craft. It takes classic turn-based JRPG structure and infuses it with political stakes and unforgettable party camaraderie.",
    favoriteMoment: "Setting out on the Gauntlet Runner across the kingdom with the whole crew.",
    favoriteQuoteOrChar: "Strohl — noble resolve anchored by loyalty.",
    featured: true,
    rankOrder: 1,
    tags: [
      { id: 8, name: "fantasy", slug: "fantasy" },
      { id: 10, name: "jrpg", slug: "jrpg" },
    ],
    previousEntry: null,
    nextEntry: { title: "Persona 4 Golden", slug: "persona-4-golden" },
    relatedEntries: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 8,
    categoryId: 4,
    categoryName: "Games",
    categorySlug: "games",
    title: "Persona 4 Golden",
    slug: "persona-4-golden",
    releaseYear: 2012,
    posterUrl: "/pics/persona-4-golden.jpg",
    accentColor: "#e0a82e",
    tagline: "Rainy days in Inaba, a midnight TV mystery, and friends you never want to leave.",
    rating: 9.4,
    tier: "S",
    whyHooked:
      "No game captures small-town warmth quite like Inaba. Balancing school days, part-time jobs, and chasing the truth inside the TV makes the Investigation Team feel like real friends.",
    favoriteMoment: "Walking home through the fog while 'Heartbeat, Heartbreak' plays.",
    favoriteQuoteOrChar: "The Investigation Team — Junes afternoons that feel like home.",
    featured: false,
    rankOrder: 2,
    tags: [
      { id: 1, name: "mystery", slug: "mystery" },
      { id: 10, name: "jrpg", slug: "jrpg" },
    ],
    previousEntry: { title: "Metaphor: ReFantazio", slug: "metaphor-refantazio" },
    nextEntry: null,
    relatedEntries: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
];

// Populate relatedEntries for each fallback item
for (const entry of FALLBACK_ENTRIES) {
  const tagSlugs = new Set(entry.tags.map((t) => t.slug));
  entry.relatedEntries = FALLBACK_ENTRIES.filter(
    (other) => other.id !== entry.id && other.tags.some((t) => tagSlugs.has(t.slug)),
  ).slice(0, 4);
}

export const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, name: "Series", slug: "series", sortOrder: 1, artSeed: 3, entryCount: 2, entries: [] },
  { id: 2, name: "Films", slug: "films", sortOrder: 2, artSeed: 11, entryCount: 1, entries: [] },
  { id: 3, name: "Anime", slug: "anime", sortOrder: 3, artSeed: 23, entryCount: 3, entries: [] },
  { id: 4, name: "Games", slug: "games", sortOrder: 4, artSeed: 37, entryCount: 2, entries: [] },
].map((cat) => {
  const catEntries = FALLBACK_ENTRIES.filter((e) => e.categoryId === cat.id);
  return {
    ...cat,
    entryCount: catEntries.length,
    entries: catEntries.map((e) => ({
      id: e.id,
      title: e.title,
      slug: e.slug,
      releaseYear: e.releaseYear,
      posterUrl: e.posterUrl,
      tier: e.tier,
    })),
  };
});

export const FALLBACK_SITE: SiteSettings = {
  siteName: "Hall of Fame",
  greeting: "Hey, I'm",
  heroName: "Phawat",
  heroBio: "My personal archive of series, films, anime, games, and music that stayed with me.",
  portraitUrl: "/pics/me.png",
  aboutBio: "I keep this personal Hall of Fame for stories, worlds, and albums that stuck with me long after the credits rolled.",
  aboutPurpose: "Not a review aggregator or a rating spreadsheet — just an honest shelf of favorites and why they mattered.",
  currentlyWatchingPlaying: "Rewatching DARK, playing Metaphor: ReFantazio, and curating new entries.",
  entryCount: FALLBACK_ENTRIES.length,
};

export function filterFallbackEntries(params?: {
  category?: string;
  tag?: string;
  q?: string;
  sort?: string;
  featured?: boolean;
}): EntrySummary[] {
  let list = [...FALLBACK_ENTRIES];
  if (params?.category) list = list.filter((e) => e.categorySlug === params.category);
  if (params?.tag) list = list.filter((e) => e.tags.some((t) => t.slug === params.tag));
  if (params?.featured !== undefined) list = list.filter((e) => e.featured === params.featured);
  if (params?.q?.trim()) {
    const q = params.q.trim().toLowerCase();
    list = list.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.tagline ?? "").toLowerCase().includes(q) ||
        e.whyHooked.toLowerCase().includes(q),
    );
  }
  if (params?.sort === "rating") {
    list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  } else if (params?.sort === "newest") {
    list.sort((a, b) => b.id - a.id);
  } else {
    list.sort((a, b) => a.rankOrder - b.rankOrder || a.id - b.id);
  }
  return list;
}

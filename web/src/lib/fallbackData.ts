import type { Category, EntryDetail, EntrySummary, SiteSettings } from "./types";

function svgPoster(title: string, subtitle: string, bgDark: string, bgMid: string, accent: string, variant: number): string {
  const cx1 = 120 + (variant * 47) % 240;
  const cy1 = 80 + (variant * 31) % 160;
  const cx2 = 420 - (variant * 39) % 200;
  const cy2 = 240 - (variant * 27) % 120;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bgDark}"/>
        <stop offset="55%" stop-color="${bgMid}"/>
        <stop offset="100%" stop-color="#000000"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" fill="url(#g)"/>
    <circle cx="${cx1}" cy="${cy1}" r="145" fill="${accent}" fill-opacity="0.22"/>
    <circle cx="${cx2}" cy="${cy2}" r="110" fill="#e6e4dd" fill-opacity="0.08"/>
    <rect x="34" y="34" width="532" height="332" rx="18" fill="none" stroke="${accent}" stroke-opacity="0.45" stroke-width="1.5"/>
    <text x="56" y="84" fill="${accent}" font-family="ui-monospace, monospace" font-size="14" letter-spacing="3">${subtitle}</text>
    <text x="56" y="316" fill="#e6e4dd" font-family="system-ui, sans-serif" font-weight="700" font-size="38" letter-spacing="1">${title}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

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
    posterUrl: svgPoster("DARK", "SERIES · 2017", "#090c0e", "#1a2124", "#e0a82e", 1),
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
    nextEntry: { title: "Severance", slug: "severance" },
    relatedEntries: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 2,
    categoryId: 1,
    categoryName: "Series",
    categorySlug: "series",
    title: "Severance",
    slug: "severance",
    releaseYear: 2022,
    posterUrl: svgPoster("SEVERANCE", "SERIES · 2022", "#111619", "#3d4a44", "#c8c6be", 2),
    accentColor: "#c8c6be",
    tagline: "Sterile fluorescent hallways hiding an eerie meditation on identity and work.",
    rating: 9.4,
    tier: "S",
    whyHooked:
      "The contrast between deadpan office absurdity and mounting dread is razor sharp. Every symmetrical corridor shot feels claustrophobic, yet the characters' quiet camaraderie makes the rebellion intensely moving.",
    favoriteMoment: "The season finale elevator switch sequence where every second counts.",
    favoriteQuoteOrChar: "Helly R. — refusing to accept a life without agency.",
    featured: true,
    rankOrder: 2,
    tags: [
      { id: 2, name: "sci-fi", slug: "sci-fi" },
      { id: 1, name: "mystery", slug: "mystery" },
      { id: 5, name: "thriller", slug: "thriller" },
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
    title: "Arrival",
    slug: "arrival",
    releaseYear: 2016,
    posterUrl: svgPoster("ARRIVAL", "FILM · 2016", "#090c0e", "#111619", "#929994", 3),
    accentColor: "#929994",
    tagline: "First contact told through linguistics, grief, and the shape of memory.",
    rating: 9.6,
    tier: "S",
    whyHooked:
      "It treats communication as a patient puzzle rather than a firefight. The sound design hums through your chest, and the emotional framing reframes every scene on a second watch.",
    favoriteMoment: "Decoding the circular ink logograms as the score swells in the mist.",
    favoriteQuoteOrChar: "Louise Banks — choosing presence even while knowing the cost.",
    featured: true,
    rankOrder: 1,
    tags: [
      { id: 2, name: "sci-fi", slug: "sci-fi" },
      { id: 6, name: "drama", slug: "drama" },
      { id: 4, name: "slow-burn", slug: "slow-burn" },
    ],
    previousEntry: null,
    nextEntry: { title: "Spirited Away", slug: "spirited-away" },
    relatedEntries: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 4,
    categoryId: 2,
    categoryName: "Films",
    categorySlug: "films",
    title: "Spirited Away",
    slug: "spirited-away",
    releaseYear: 2001,
    posterUrl: svgPoster("SPIRITED AWAY", "FILM · 2001", "#111619", "#3d4a44", "#e0a82e", 4),
    accentColor: "#e0a82e",
    tagline: "A threshold into a dreamlike bathhouse world of spirits, labor, and courage.",
    rating: 9.5,
    tier: "S",
    whyHooked:
      "Every frame breathes with lived-in texture: steam rising from wooden tubs, quiet train rides over flooded tracks, and small moments of kindness in a strange place.",
    favoriteMoment: "The silent train journey across endless shallow water at dusk.",
    favoriteQuoteOrChar: "Chihiro — growing steady without losing her warmth.",
    featured: true,
    rankOrder: 2,
    tags: [
      { id: 7, name: "animation", slug: "animation" },
      { id: 8, name: "fantasy", slug: "fantasy" },
    ],
    previousEntry: { title: "Arrival", slug: "arrival" },
    nextEntry: null,
    relatedEntries: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 5,
    categoryId: 3,
    categoryName: "Anime",
    categorySlug: "anime",
    title: "Steins;Gate",
    slug: "steins-gate",
    releaseYear: 2011,
    posterUrl: svgPoster("STEINS;GATE", "ANIME · 2011", "#000000", "#1a2124", "#e0a82e", 5),
    accentColor: "#e0a82e",
    tagline: "From cluttered summer lab banter to a relentless race against causality.",
    rating: 9.5,
    tier: "S",
    whyHooked:
      "The slow, quirky first half makes the sudden tonal turn devastating because you genuinely care about every person in that tiny apartment lab.",
    favoriteMoment: "The realization that undoing each message requires giving up something precious.",
    favoriteQuoteOrChar: "Kurisu Makise — sharp wit hiding deep loyalty.",
    featured: true,
    rankOrder: 1,
    tags: [
      { id: 2, name: "sci-fi", slug: "sci-fi" },
      { id: 3, name: "time-loop", slug: "time-loop" },
      { id: 5, name: "thriller", slug: "thriller" },
    ],
    previousEntry: null,
    nextEntry: { title: "Frieren: Beyond Journey's End", slug: "frieren-beyond-journey-s-end" },
    relatedEntries: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 6,
    categoryId: 3,
    categoryName: "Anime",
    categorySlug: "anime",
    title: "Frieren: Beyond Journey's End",
    slug: "frieren-beyond-journey-s-end",
    releaseYear: 2023,
    posterUrl: svgPoster("FRIEREN", "ANIME · 2023", "#090c0e", "#3d4a44", "#e6e4dd", 6),
    accentColor: "#e6e4dd",
    tagline: "What happens after the grand quest ends, measured in decades and small memories.",
    rating: 9.3,
    tier: "S",
    whyHooked:
      "Instead of rushing toward the next boss battle, it lingers on changing seasons, half-remembered kindnesses, and learning to notice people while they are still here.",
    favoriteMoment: "The quiet meteor shower seen decades later with new companions.",
    favoriteQuoteOrChar: "Frieren — centuries of quiet reflection distilled into gentle curiosity.",
    featured: false,
    rankOrder: 2,
    tags: [
      { id: 8, name: "fantasy", slug: "fantasy" },
      { id: 4, name: "slow-burn", slug: "slow-burn" },
    ],
    previousEntry: { title: "Steins;Gate", slug: "steins-gate" },
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
    title: "Outer Wilds",
    slug: "outer-wilds",
    releaseYear: 2019,
    posterUrl: svgPoster("OUTER WILDS", "GAME · 2019", "#000000", "#111619", "#e0a82e", 7),
    accentColor: "#e0a82e",
    tagline: "A miniature solar system where curiosity is the only progression system.",
    rating: 9.9,
    tier: "S",
    whyHooked:
      "Nothing is gated behind upgrades or skill trees—only your own understanding of how a clockwork universe fits together. Every twenty-two-minute loop brings an unforgettable discovery.",
    favoriteMoment: "Hearing the distant banjo echo across a collapsing cavern while the star shifts color.",
    favoriteQuoteOrChar: "The Travelers — campfire music at the edge of everything.",
    featured: true,
    rankOrder: 1,
    tags: [
      { id: 2, name: "sci-fi", slug: "sci-fi" },
      { id: 1, name: "mystery", slug: "mystery" },
      { id: 3, name: "time-loop", slug: "time-loop" },
    ],
    previousEntry: null,
    nextEntry: { title: "Hollow Knight", slug: "hollow-knight" },
    relatedEntries: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 8,
    categoryId: 4,
    categoryName: "Games",
    categorySlug: "games",
    title: "Hollow Knight",
    slug: "hollow-knight",
    releaseYear: 2017,
    posterUrl: svgPoster("HOLLOW KNIGHT", "GAME · 2017", "#090c0e", "#1a2124", "#c8c6be", 8),
    accentColor: "#c8c6be",
    tagline: "Hand-drawn subterranean melancholy paired with razor-tight exploration.",
    rating: 9.2,
    tier: "A",
    whyHooked:
      "Getting lost in a fallen kingdom feels wondrous rather than frustrating because every screen rewards observation with lore, music, and crisp combat rhythm.",
    favoriteMoment: "Stepping into the rain-swept City of Tears for the very first time.",
    favoriteQuoteOrChar: "Quirrel — a wandering scholar taking in the quiet view by the lake.",
    featured: false,
    rankOrder: 2,
    tags: [{ id: 8, name: "fantasy", slug: "fantasy" }],
    previousEntry: { title: "Outer Wilds", slug: "outer-wilds" },
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
  { id: 2, name: "Films", slug: "films", sortOrder: 2, artSeed: 11, entryCount: 2, entries: [] },
  { id: 3, name: "Anime", slug: "anime", sortOrder: 3, artSeed: 23, entryCount: 2, entries: [] },
  { id: 4, name: "Games", slug: "games", sortOrder: 4, artSeed: 37, entryCount: 2, entries: [] },
].map((cat) => ({
  ...cat,
  entries: FALLBACK_ENTRIES.filter((e) => e.categoryId === cat.id).map((e) => ({
    id: e.id,
    title: e.title,
    slug: e.slug,
    releaseYear: e.releaseYear,
    posterUrl: e.posterUrl,
    tier: e.tier,
  })),
}));

export const FALLBACK_SITE: SiteSettings = {
  siteName: "Hall of Fame",
  greeting: "Hey, I'm",
  heroName: "Phawat",
  heroBio: "My personal archive of series, films, anime, games, and music that stayed with me.",
  portraitUrl: "",
  aboutBio: "I keep this personal Hall of Fame for stories, worlds, and albums that stuck with me long after the credits rolled.",
  aboutPurpose: "Not a review aggregator or a rating spreadsheet — just an honest shelf of favorites and why they mattered.",
  currentlyWatchingPlaying: "Rewatching DARK, exploring indie puzzle boxes, and listening to late-night soundtracks.",
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

package com.halloffame.seed;

import com.halloffame.dto.CategoryDto.CreateCategoryRequest;
import com.halloffame.dto.EntryDto.UpsertEntryRequest;
import com.halloffame.entity.EntryEntity.Tier;
import com.halloffame.repository.CategoryRepository;
import com.halloffame.repository.EntryRepository;
import com.halloffame.service.CategoryService;
import com.halloffame.service.EntryService;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
@Order(2)
public class DevSeedRunner implements ApplicationRunner {

    private final CategoryRepository categoryRepository;
    private final EntryRepository entryRepository;
    private final CategoryService categoryService;
    private final EntryService entryService;

    public DevSeedRunner(
        CategoryRepository categoryRepository,
        EntryRepository entryRepository,
        CategoryService categoryService,
        EntryService entryService
    ) {
        this.categoryRepository = categoryRepository;
        this.entryRepository = entryRepository;
        this.categoryService = categoryService;
        this.entryService = entryService;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (categoryRepository.count() > 0 || entryRepository.count() > 0) {
            return;
        }

        var series = categoryService.create(new CreateCategoryRequest("Series", 1, 3));
        var films = categoryService.create(new CreateCategoryRequest("Films", 2, 11));
        var anime = categoryService.create(new CreateCategoryRequest("Anime", 3, 23));
        var games = categoryService.create(new CreateCategoryRequest("Games", 4, 37));

        entryService.create(new UpsertEntryRequest(
            series.id(),
            "DARK",
            2017,
            svgArtwork("DARK", "SERIES · 2017", "#0d0a38", "#3a1e5d", "#a678a2", 1),
            "#a678a2",
            "A puzzle-box family mystery set in a quiet rain-soaked forest town across connected eras.",
            new BigDecimal("9.8"),
            Tier.S,
            "Few shows respect the viewer's memory the way DARK does. Every detail planted in the first hour loops back seasons later with emotional weight rather than empty shock value. The score, rain-drenched cinematography, and patient pacing turn intricate time-loop mechanics into a deeply human tragedy.",
            "The quiet realization across parallel timelines in the final cycle, when every seemingly separate family thread locks together.",
            "Jonas Kahnwald — calm curiosity carrying an impossible burden.",
            true,
            1,
            List.of("mystery", "sci-fi", "time-loop", "slow-burn")
        ));

        entryService.create(new UpsertEntryRequest(
            series.id(),
            "Severance",
            2022,
            svgArtwork("SEVERANCE", "SERIES · 2022", "#1b0e4a", "#5b2c6f", "#d6b2c6", 2),
            "#d6b2c6",
            "Sterile fluorescent hallways hiding an eerie meditation on identity and work.",
            new BigDecimal("9.4"),
            Tier.S,
            "The contrast between deadpan office absurdity and mounting dread is razor sharp. Every symmetrical corridor shot feels claustrophobic, yet the characters' quiet camaraderie makes the rebellion intensely moving.",
            "The season finale elevator switch sequence where every second counts.",
            "Helly R. — refusing to accept a life without agency.",
            true,
            2,
            List.of("sci-fi", "mystery", "thriller")
        ));

        entryService.create(new UpsertEntryRequest(
            films.id(),
            "Arrival",
            2016,
            svgArtwork("ARRIVAL", "FILM · 2016", "#0d0a38", "#1b0e4a", "#c59bb6", 3),
            "#c59bb6",
            "First contact told through linguistics, grief, and the shape of memory.",
            new BigDecimal("9.6"),
            Tier.S,
            "It treats communication as a patient puzzle rather than a firefight. The sound design hums through your chest, and the emotional framing reframes every scene on a second watch.",
            "Decoding the circular ink logograms as the score swells in the mist.",
            "Louise Banks — choosing presence even while knowing the cost.",
            true,
            1,
            List.of("sci-fi", "drama", "slow-burn")
        ));

        entryService.create(new UpsertEntryRequest(
            films.id(),
            "Spirited Away",
            2001,
            svgArtwork("SPIRITED AWAY", "FILM · 2001", "#1b0e4a", "#7c4a8e", "#e0c2d5", 4),
            "#e0c2d5",
            "A threshold into a dreamlike bathhouse world of spirits, labor, and courage.",
            new BigDecimal("9.5"),
            Tier.S,
            "Every frame breathes with lived-in texture: steam rising from wooden tubs, quiet train rides over flooded tracks, and small moments of kindness in a strange place.",
            "The silent train journey across endless shallow water at dusk.",
            "Chihiro — growing steady without losing her warmth.",
            true,
            2,
            List.of("animation", "fantasy", "coming-of-age")
        ));

        entryService.create(new UpsertEntryRequest(
            anime.id(),
            "Steins;Gate",
            2011,
            svgArtwork("STEINS;GATE", "ANIME · 2011", "#000000", "#3a1e5d", "#a678a2", 5),
            "#a678a2",
            "From cluttered summer lab banter to a relentless race against causality.",
            new BigDecimal("9.5"),
            Tier.S,
            "The slow, quirky first half makes the sudden tonal turn devastating because you genuinely care about every person in that tiny apartment lab.",
            "The realization that undoing each message requires giving up something precious.",
            "Kurisu Makise — sharp wit hiding deep loyalty.",
            true,
            1,
            List.of("sci-fi", "time-loop", "thriller", "anime")
        ));

        entryService.create(new UpsertEntryRequest(
            anime.id(),
            "Frieren: Beyond Journey's End",
            2023,
            svgArtwork("FRIEREN", "ANIME · 2023", "#0d0a38", "#5b2c6f", "#e0c2d5", 6),
            "#e0c2d5",
            "What happens after the grand quest ends, measured in decades and small memories.",
            new BigDecimal("9.3"),
            Tier.S,
            "Instead of rushing toward the next boss battle, it lingers on changing seasons, half-remembered kindnesses, and learning to notice people while they are still here.",
            "The quiet meteor shower seen decades later with new companions.",
            "Frieren — centuries of quiet reflection distilled into gentle curiosity.",
            false,
            2,
            List.of("fantasy", "slow-burn", "anime")
        ));

        entryService.create(new UpsertEntryRequest(
            games.id(),
            "Outer Wilds",
            2019,
            svgArtwork("OUTER WILDS", "GAME · 2019", "#000000", "#1b0e4a", "#d6b2c6", 7),
            "#d6b2c6",
            "A miniature solar system where curiosity is the only progression system.",
            new BigDecimal("9.9"),
            Tier.S,
            "Nothing is gated behind upgrades or skill trees—only your own understanding of how a clockwork universe fits together. Every twenty-two-minute loop brings an unforgettable discovery.",
            "Hearing the distant banjo echo across a collapsing cavern while the star shifts color.",
            "The Travelers — campfire music at the edge of everything.",
            true,
            1,
            List.of("sci-fi", "mystery", "time-loop", "indie")
        ));

        entryService.create(new UpsertEntryRequest(
            games.id(),
            "Hollow Knight",
            2017,
            svgArtwork("HOLLOW KNIGHT", "GAME · 2017", "#0d0a38", "#3a1e5d", "#c59bb6", 8),
            "#c59bb6",
            "Hand-drawn subterranean melancholy paired with razor-tight exploration.",
            new BigDecimal("9.2"),
            Tier.A,
            "Getting lost in a fallen kingdom feels wondrous rather than frustrating because every screen rewards observation with lore, music, and crisp combat rhythm.",
            "Stepping into the rain-swept City of Tears for the very first time.",
            "Quirrel — a wandering scholar taking in the quiet view by the lake.",
            false,
            2,
            List.of("indie", "fantasy", "metroidvania")
        ));
    }

    private static String svgArtwork(
        String title,
        String subtitle,
        String bgDark,
        String bgMid,
        String accent,
        int variant
    ) {
        int cx1 = 120 + (variant * 47) % 240;
        int cy1 = 80 + (variant * 31) % 160;
        int cx2 = 420 - (variant * 39) % 200;
        int cy2 = 240 - (variant * 27) % 120;
        String safeTitle = escapeXml(title);
        String safeSubtitle = escapeXml(subtitle);
        String svg = """
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%%" stop-color="%s"/>
                  <stop offset="55%%" stop-color="%s"/>
                  <stop offset="100%%" stop-color="#000000"/>
                </linearGradient>
              </defs>
              <rect width="600" height="400" fill="url(#g)"/>
              <circle cx="%d" cy="%d" r="145" fill="%s" fill-opacity="0.22"/>
              <circle cx="%d" cy="%d" r="110" fill="#e0c2d5" fill-opacity="0.10"/>
              <rect x="34" y="34" width="532" height="332" rx="18" fill="none" stroke="%s" stroke-opacity="0.45" stroke-width="1.5"/>
              <text x="56" y="84" fill="%s" font-family="ui-monospace, monospace" font-size="14" letter-spacing="3">%s</text>
              <text x="56" y="316" fill="#e0c2d5" font-family="system-ui, sans-serif" font-weight="700" font-size="38" letter-spacing="1">%s</text>
            </svg>
            """.formatted(bgDark, bgMid, cx1, cy1, accent, cx2, cy2, accent, accent, safeSubtitle, safeTitle);
        String encoded = Base64.getEncoder().encodeToString(svg.getBytes(StandardCharsets.UTF_8));
        return "data:image/svg+xml;base64," + encoded;
    }

    private static String escapeXml(String s) {
        return s.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&apos;");
    }
}

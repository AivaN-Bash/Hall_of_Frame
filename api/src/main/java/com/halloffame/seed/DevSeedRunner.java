package com.halloffame.seed;

import com.halloffame.dto.CategoryDto.CreateCategoryRequest;
import com.halloffame.dto.EntryDto.UpsertEntryRequest;
import com.halloffame.entity.EntryEntity.Tier;
import com.halloffame.repository.CategoryRepository;
import com.halloffame.repository.EntryRepository;
import com.halloffame.service.CategoryService;
import com.halloffame.service.EntryService;
import java.math.BigDecimal;
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
            "/pics/dark.jpg",
            "#e0a82e",
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
            "The Queen's Gambit",
            2020,
            "/pics/queens-gambit.jpg",
            "#c8c6be",
            "An orphan prodigy turns sixty-four squares into a battlefield of obsession and grace.",
            new BigDecimal("9.3"),
            Tier.S,
            "Every chess match feels like a high-stakes duel even if you barely know the openings. The wardrobe, mid-century production design, and Beth Harmon's quiet intensity make every quiet room electric.",
            "Looking up at the ceiling in Moscow as the final endgame clicks into place.",
            "Beth Harmon — sharp, guarded, and endlessly compelling.",
            true,
            2,
            List.of("drama", "coming-of-age")
        ));

        entryService.create(new UpsertEntryRequest(
            films.id(),
            "Catch Me If You Can",
            2002,
            "/pics/catch-me-if-you-can.jpg",
            "#e0a82e",
            "A breezy cat-and-mouse chase built on charm, loneliness, and forged checks.",
            new BigDecimal("9.2"),
            Tier.S,
            "Spielberg directs it with effortless momentum, yet underneath the caper is a surprisingly tender story about a kid trying to outrun a broken home. The cat-and-mouse dynamic between Frank and Carl never gets old.",
            "The Christmas Eve phone call where pursuit turns into the only family either of them has.",
            "Carl Hanratty — weary persistence hiding genuine care.",
            true,
            1,
            List.of("drama", "crime")
        ));

        entryService.create(new UpsertEntryRequest(
            anime.id(),
            "Frieren: Beyond Journey's End",
            2023,
            "/pics/frieren.jpg",
            "#e6e4dd",
            "What happens after the grand quest ends, measured in decades and small memories.",
            new BigDecimal("9.6"),
            Tier.S,
            "Instead of rushing toward the next boss battle, it lingers on changing seasons, half-remembered kindnesses, and learning to notice people while they are still here.",
            "The quiet meteor shower seen decades later with new companions.",
            "Frieren — centuries of quiet reflection distilled into gentle curiosity.",
            true,
            1,
            List.of("fantasy", "slow-burn", "anime")
        ));

        entryService.create(new UpsertEntryRequest(
            anime.id(),
            "Made in Abyss",
            2017,
            "/pics/made-in-abyss.jpg",
            "#929994",
            "A luminous, terrifying descent into an uncharted vertical world.",
            new BigDecimal("9.4"),
            Tier.S,
            "Kevin Penkin's score and the breathtaking painted backgrounds draw you into a fairy-tale expedition, before the Abyss reveals how merciless and unforgettable its depths really are.",
            "Descending through the Sea of Corpses as the music swells over the abyssal horizon.",
            "Nanachi — carrying grief with quiet resilience.",
            false,
            2,
            List.of("fantasy", "mystery", "anime")
        ));

        entryService.create(new UpsertEntryRequest(
            anime.id(),
            "Vinland Saga",
            2019,
            "/pics/vinland-saga.jpg",
            "#c8c6be",
            "A story about vengeance that grows into a meditation on peace and redemption.",
            new BigDecimal("9.5"),
            Tier.S,
            "Watching Thorfinn's transformation from consumed by rage to asking what it truly means to be a warrior is one of the most earned character arcs in any medium.",
            "Thorfinn declaring he has no enemies.",
            "Askeladd — cynical, brilliant, and tragic to the very end.",
            true,
            3,
            List.of("drama", "anime")
        ));

        entryService.create(new UpsertEntryRequest(
            games.id(),
            "Metaphor: ReFantazio",
            2024,
            "/pics/metaphor.jpg",
            "#e0a82e",
            "A royal tournament across a fractured fantasy realm driven by ideals and style.",
            new BigDecimal("9.5"),
            Tier.S,
            "Every menu, battle transition, and road-trip camp scene bursts with craft. It takes classic turn-based JRPG structure and infuses it with political stakes and unforgettable party camaraderie.",
            "Setting out on the Gauntlet Runner across the kingdom with the whole crew.",
            "Strohl — noble resolve anchored by loyalty.",
            true,
            1,
            List.of("fantasy", "jrpg")
        ));

        entryService.create(new UpsertEntryRequest(
            games.id(),
            "Persona 4 Golden",
            2012,
            "/pics/persona-4-golden.jpg",
            "#e0a82e",
            "Rainy days in Inaba, a midnight TV mystery, and friends you never want to leave.",
            new BigDecimal("9.4"),
            Tier.S,
            "No game captures small-town warmth quite like Inaba. Balancing school days, part-time jobs, and chasing the truth inside the TV makes the Investigation Team feel like real friends.",
            "Walking home through the fog while 'Heartbeat, Heartbreak' plays.",
            "The Investigation Team — Junes afternoons that feel like home.",
            false,
            2,
            List.of("mystery", "jrpg")
        ));
    }
}

package com.cineverse.service;

import com.cineverse.model.entity.*;
import com.cineverse.model.enums.*;
import com.cineverse.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.*;

@Service
public class DataSeederService implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeederService.class);

    private final AppUserRepository userRepository;
    private final FranchiseRepository franchiseRepository;
    private final UniverseRepository universeRepository;
    private final TimelineRepository timelineRepository;
    private final SagaRepository sagaRepository;
    private final PhaseRepository phaseRepository;
    private final ContentRepository contentRepository;
    private final SeasonRepository seasonRepository;
    private final EpisodeRepository episodeRepository;
    private final ContentRelationshipRepository relationshipRepository;
    private final PlatformRepository platformRepository;
    private final PlatformAvailabilityRepository platformAvailabilityRepository;
    private final ExternalSourceRepository externalSourceRepository;
    private final AnnouncementRepository announcementRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeederService(AppUserRepository userRepository,
                             FranchiseRepository franchiseRepository,
                             UniverseRepository universeRepository,
                             TimelineRepository timelineRepository,
                             SagaRepository sagaRepository,
                             PhaseRepository phaseRepository,
                             ContentRepository contentRepository,
                             SeasonRepository seasonRepository,
                             EpisodeRepository episodeRepository,
                             ContentRelationshipRepository relationshipRepository,
                             PlatformRepository platformRepository,
                             PlatformAvailabilityRepository platformAvailabilityRepository,
                             ExternalSourceRepository externalSourceRepository,
                             AnnouncementRepository announcementRepository,
                             PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.franchiseRepository = franchiseRepository;
        this.universeRepository = universeRepository;
        this.timelineRepository = timelineRepository;
        this.sagaRepository = sagaRepository;
        this.phaseRepository = phaseRepository;
        this.contentRepository = contentRepository;
        this.seasonRepository = seasonRepository;
        this.episodeRepository = episodeRepository;
        this.relationshipRepository = relationshipRepository;
        this.platformRepository = platformRepository;
        this.platformAvailabilityRepository = platformAvailabilityRepository;
        this.externalSourceRepository = externalSourceRepository;
        this.announcementRepository = announcementRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        boolean hasWakanda = contentRepository.findBySlug("black-panther-wakanda-forever").isPresent();
        boolean hasGuardians3 = contentRepository.findBySlug("guardians-of-the-galaxy-vol-3").isPresent();
        boolean hasBraveNewWorld = contentRepository.findBySlug("captain-america-brave-new-world").isPresent();
        long count = contentRepository.count();

        if (count >= 75 && hasWakanda && hasGuardians3 && hasBraveNewWorld) {
            log.info("Database already seeded with complete Marvel canon dataset ({} items). Running incremental sync.", count);
            syncMissingContentFromJson();
            return;
        }

        log.info("Full Marvel canon re-seeding required (current count: {}). Clearing old records and seeding fresh...", count);

        // If partially seeded from old run, clear out to reseed fresh with full 78+ items
        if (franchiseRepository.count() > 0) {
            relationshipRepository.deleteAll();
            platformAvailabilityRepository.deleteAll();
            episodeRepository.deleteAll();
            seasonRepository.deleteAll();
            contentRepository.deleteAll();
            phaseRepository.deleteAll();
            sagaRepository.deleteAll();
            timelineRepository.deleteAll();
            universeRepository.deleteAll();
            franchiseRepository.deleteAll();
            announcementRepository.deleteAll();
            externalSourceRepository.deleteAll();
            platformRepository.deleteAll();
            userRepository.deleteAll();
        }

        seedUsers();
        seedPlatforms();
        seedExternalSources();
        seedFranchisesAndContent();
        log.info("Seeding complete! Total content items now in database: {}", contentRepository.count());
    }

    private void seedUsers() {
        Optional<AppUser> existingAdmin = userRepository.findByUsername("admin");
        if (existingAdmin.isPresent()) {
            AppUser admin = existingAdmin.get();
            admin.setPassword(passwordEncoder.encode("OmniVerse#2026!Admin"));
            admin.setEmail("admin@omniverse.io");
            admin.setRole(Role.ROLE_ADMIN);
            userRepository.save(admin);
        } else {
            AppUser admin = new AppUser("admin", "admin@omniverse.io", passwordEncoder.encode("OmniVerse#2026!Admin"), Role.ROLE_ADMIN);
            userRepository.save(admin);
        }
    }

    private void seedPlatforms() {
        Platform dplus = new Platform("Disney+", "disney-plus", "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg", "https://www.disneyplus.com", "#113CCF");
        Platform netflix = new Platform("Netflix", "netflix", "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", "https://www.netflix.com", "#E50914");
        Platform prime = new Platform("Prime Video", "prime-video", "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png", "https://www.primevideo.com", "#00A8E1");
        Platform max = new Platform("Max", "max", "https://upload.wikimedia.org/wikipedia/commons/c/ce/Max_logo.svg", "https://www.max.com", "#002BE7");
        Platform apple = new Platform("Apple TV+", "apple-tv", "https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_plus_logo.svg", "https://tv.apple.com", "#000000");
        platformRepository.saveAll(List.of(dplus, netflix, prime, max, apple));
    }

    private void seedExternalSources() {
        ExternalSource marvelSource = new ExternalSource("Marvel Official Website", "https://www.marvel.com/articles", 100);
        ExternalSource disneyPress = new ExternalSource("Disney Press Announcements", "https://press.disneyplus.com", 100);
        ExternalSource sonySource = new ExternalSource("Sony Pictures Entertainment", "https://www.sonypictures.com/movies", 95);
        externalSourceRepository.saveAll(List.of(marvelSource, disneyPress, sonySource));

        Announcement a1 = new Announcement(
                "Marvel Studios Unveils Multiverse Phase 6 & Beyond Slate",
                "Official confirmation: Avengers: Doomsday arrives in theaters December 18, 2026, followed by Avengers: Secret Wars scheduled for Dec 17, 2027, Ghost Rider on Feb 18, 2028, X-Men on May 5, 2028, and Black Panther 3 on Dec 22, 2028.",
                AnnouncementType.PRODUCTION,
                "Marvel",
                "https://marvel.com/articles"
        );
        Announcement a2 = new Announcement(
                "Spider-Man: Brand New Day & Fantastic Four: Now Released Worldwide",
                "Tom Holland's Peter Parker begins an all-new street-level chapter in Spider-Man: Brand New Day (Released Sep 30, 2026). The Fantastic Four: First Steps is also already released, setting up the impending collision in Avengers: Doomsday.",
                AnnouncementType.DATE_CHANGE,
                "Marvel",
                "https://marvel.com/articles"
        );
        announcementRepository.saveAll(List.of(a1, a2));
    }

    private void seedFranchisesAndContent() {
        Platform dplus = platformRepository.findBySlug("disney-plus").orElse(null);

        // 1. Franchise
        Franchise marvel = new Franchise(
                "Marvel",
                "marvel",
                "The vast Marvel multiverse comprising the Marvel Cinematic Universe, Tobey Maguire Raimi Universe, Andrew Garfield Amazing Universe, Fox X-Men Universe, and animated timelines.",
                "https://image.tmdb.org/t/p/w1280/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
                "https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg",
                1
        );
        franchiseRepository.save(marvel);

        // 2. Universes
        Universe mcu = new Universe(marvel, "Marvel Cinematic Universe", "mcu", "Earth-616 / Earth-199999",
                "The core cinematic universe originated with Iron Man (2008), centered around the Sacred Timeline and expanding into the Multiverse.", 1);
        Universe tobeyUniverse = new Universe(marvel, "Tobey Maguire Spider-Man Universe", "tobey-spider-verse", "Earth-96283",
                "The classic cinematic Spider-Man continuity directed by Sam Raimi, featuring Tobey Maguire as Peter Parker, Green Goblin, Doc Ock, and Sandman.", 2);
        Universe andrewUniverse = new Universe(marvel, "Andrew Garfield Spider-Man Universe", "andrew-spider-verse", "Earth-120703",
                "The Amazing Spider-Man continuity directed by Marc Webb, featuring Andrew Garfield as Peter Parker, Gwen Stacy, Lizard, and Electro.", 3);
        Universe xmen = new Universe(marvel, "X-Men Legacy Universe", "x-men-universe", "Earth-10005",
                "The 20th Century Fox mutant timeline featuring Hugh Jackman's Wolverine, Patrick Stewart's Professor X, and Ryan Reynolds' Deadpool, bridged into the MCU via Deadpool & Wolverine.", 4);
        Universe spiderVerse = new Universe(marvel, "Sony's Spider-Verse / Venomverse", "spider-verse", "Earth-688",
                "The alternate dimension containing Venom, Morbius, and Madame Web, connected to MCU via multiverse cracks.", 5);
        universeRepository.saveAll(List.of(mcu, tobeyUniverse, andrewUniverse, xmen, spiderVerse));

        Map<String, Universe> universeMap = Map.of(
                "mcu", mcu,
                "tobey-spider-verse", tobeyUniverse,
                "andrew-spider-verse", andrewUniverse,
                "x-men-universe", xmen,
                "spider-verse", spiderVerse
        );

        // 3. Timelines
        Timeline sacredTimeline = new Timeline(mcu, "Sacred Timeline", "sacred-timeline", true,
                "The primary baseline continuum protected by He Who Remains.", "The central thread where all main MCU events take place.", 1);
        Timeline branchTimeline = new Timeline(mcu, "2012 Branch / TVA Void", "2012-loki-branch", false,
                "Created when 2012 Loki escaped with the Tesseract in Avengers: Endgame.", "Branch continuum leading to the TVA, the Citadel at the End of Time, and Yggdrasil.", 2);
        Timeline multiverseBranch = new Timeline(mcu, "Multiverse Branches / Battleworld", "multiverse-branches", false,
                "Spawned after the destruction of the Sacred Timeline loom.", "Infinite alternate realities explored in What If...?, MoM, No Way Home, Doomsday, and Secret Wars.", 3);
        Timeline tobeyTimeline = new Timeline(tobeyUniverse, "Earth-96283 Prime Timeline", "earth-96283-timeline", true,
                "The original 2002-2007 timeline of New York City protected by Tobey Maguire's Spider-Man.", "Raimi Trilogy continuity.", 1);
        Timeline andrewTimeline = new Timeline(andrewUniverse, "Earth-120703 Prime Timeline", "earth-120703-timeline", true,
                "The 2012-2014 timeline of Oscorp and Andrew Garfield's Spider-Man.", "Amazing Spider-Man continuity.", 1);
        Timeline xmenTimeline = new Timeline(xmen, "Earth-10005 Mutant Timeline", "earth-10005-timeline", true,
                "The mutant timeline from the Westchester school to the future Sentinel war, culminating in Logan.", "Fox X-Men continuity.", 1);
        timelineRepository.saveAll(List.of(sacredTimeline, branchTimeline, multiverseBranch, tobeyTimeline, andrewTimeline, xmenTimeline));

        Map<String, Timeline> timelineMap = Map.of(
                "sacred-timeline", sacredTimeline,
                "2012-loki-branch", branchTimeline,
                "multiverse-branches", multiverseBranch,
                "earth-96283-timeline", tobeyTimeline,
                "earth-120703-timeline", andrewTimeline,
                "earth-10005-timeline", xmenTimeline
        );

        // 4. Sagas
        Saga infinitySaga = new Saga(marvel, "The Infinity Saga", "infinity-saga", 1,
                "The epic story of the six Infinity Stones and Thanos' quest to rebalance the universe, spanning Phase 1 to Phase 3.",
                "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
                "https://image.tmdb.org/t/p/w1280/or06FN3Dka5tukK1e9sl16pB3iy.jpg");
        Saga multiverseSaga = new Saga(marvel, "The Multiverse Saga", "multiverse-saga", 2,
                "The boundless saga following the fracturing of time, incursions across dimensions, and the battle for Battleworld spanning Phase 4 to Phase 6.",
                "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
                "https://image.tmdb.org/t/p/w1280/secretwars_wide.jpg");
        Saga raimiSaga = new Saga(marvel, "Raimi Spider-Man Trilogy", "raimi-spider-man-trilogy", 3,
                "The pioneering cinematic trilogy that defined modern superhero cinema.",
                "https://image.tmdb.org/t/p/w500/gh4c2bk0QsvNTFTKWCSTNI0jh2x.jpg",
                "https://image.tmdb.org/t/p/w1280/sWvxBXNtCOaGpqL.jpg");
        Saga webbSaga = new Saga(marvel, "The Amazing Spider-Man Series", "amazing-spider-man-series", 4,
                "The emotional origin and tragedy of Peter Parker and Gwen Stacy.",
                "https://image.tmdb.org/t/p/w500/fSbqPbqXa971b4qT137iX23f8sC.jpg",
                "https://image.tmdb.org/t/p/w1280/t019340912.jpg");
        Saga mutantSaga = new Saga(marvel, "Fox Mutant Legacy Era", "fox-mutant-legacy-era", 5,
                "The groundbreaking era of mutant rights, Weapon X, and the X-Men.",
                "https://image.tmdb.org/t/p/w500/2LqaLgk4Z226KkgPJuiOQ58wvrm.jpg",
                "https://image.tmdb.org/t/p/w1280/x1029381.jpg");
        sagaRepository.saveAll(List.of(infinitySaga, multiverseSaga, raimiSaga, webbSaga, mutantSaga));

        Map<String, Saga> sagaMap = Map.of(
                "infinity-saga", infinitySaga,
                "multiverse-saga", multiverseSaga,
                "raimi-spider-man-trilogy", raimiSaga,
                "amazing-spider-man-series", webbSaga,
                "fox-mutant-legacy-era", mutantSaga
        );

        // 5. Phases
        Phase phase1 = new Phase(infinitySaga, "Phase One: Avengers Assembled", "phase-1", 1, "The formation of Earth's Mightiest Heroes.");
        Phase phase2 = new Phase(infinitySaga, "Phase Two", "phase-2", 2, "The cosmic expansion and the fall of S.H.I.E.L.D.");
        Phase phase3 = new Phase(infinitySaga, "Phase Three", "phase-3", 3, "The culmination of the Infinity Saga and Endgame.");
        Phase phase4 = new Phase(multiverseSaga, "Phase Four: Multiverse Fractured", "phase-4", 4, "Grief, rebirth, and the cracking of the Multiverse.");
        Phase phase5 = new Phase(multiverseSaga, "Phase Five: Secret Alliances", "phase-5", 5, "Rising tensions across timelines and secret wars brewing.");
        Phase phase6 = new Phase(multiverseSaga, "Phase Six: Battleworld Climax", "phase-6", 6, "The grand climax of the Multiverse Saga and Secret Wars.");
        phaseRepository.saveAll(List.of(phase1, phase2, phase3, phase4, phase5, phase6));

        Map<String, Phase> phaseMap = Map.of(
                "phase-1", phase1,
                "phase-2", phase2,
                "phase-3", phase3,
                "phase-4", phase4,
                "phase-5", phase5,
                "phase-6", phase6
        );

        // 6. Ingest All 78 Content Items from Verified JSON
        Map<String, Content> contentMap = new HashMap<>();
        try {
            ClassPathResource resource = new ClassPathResource("data/marvel_content.json");
            if (resource.exists()) {
                try (InputStream is = resource.getInputStream()) {
                    JsonNode root = new ObjectMapper().readTree(is);
                    for (JsonNode node : root) {
                        String slug = node.path("slug").asText();
                        Content c = new Content();
                        c.setTitle(node.path("title").asText());
                        c.setOriginalTitle(node.path("originalTitle").asText(c.getTitle()));
                        c.setSlug(slug);
                        c.setContentType(ContentType.valueOf(node.path("contentType").asText("MOVIE")));
                        c.setStatus(ContentStatus.valueOf(node.path("status").asText("RELEASED")));
                        if (node.hasNonNull("releaseDate") && !node.path("releaseDate").asText().isEmpty()) {
                            c.setReleaseDate(LocalDate.parse(node.path("releaseDate").asText()));
                        }
                        c.setReleaseYear(node.path("releaseYear").asInt());
                        c.setRuntimeMinutes(node.path("runtimeMinutes").asInt());
                        c.setRating(node.path("rating").asText());
                        c.setGenres(node.path("genres").asText());
                        c.setShortSynopsis(node.path("shortSynopsis").asText());
                        c.setFullSynopsis(node.path("fullSynopsis").asText());
                        c.setDirector(node.path("director").asText());
                        c.setWriters(node.path("writers").asText());
                        c.setCastMembers(node.path("castMembers").asText());
                        c.setProductionStudio(node.path("productionStudio").asText("Marvel Studios"));
                        c.setPosterUrl(node.path("posterUrl").asText());
                        c.setBackdropUrl(node.path("backdropUrl").asText());
                        c.setReleaseOrderNum(node.hasNonNull("releaseOrderNum") ? node.path("releaseOrderNum").asInt() : null);
                        c.setChronologicalOrderNum(node.hasNonNull("chronologicalOrderNum") ? node.path("chronologicalOrderNum").asInt() : null);
                        c.setTimelineOrderNum(node.hasNonNull("timelineOrderNum") ? node.path("timelineOrderNum").asInt() : null);
                        c.setHasSpoilers(node.path("hasSpoilers").asBoolean(false));
                        c.setPostCreditScene(node.hasNonNull("postCreditScene") ? node.path("postCreditScene").asText() : null);
                        c.setIsPublished(true);

                        c.setFranchise(marvel);
                        c.setUniverse(universeMap.get(node.path("universeSlug").asText("mcu")));
                        c.setTimeline(timelineMap.get(node.path("timelineSlug").asText("sacred-timeline")));
                        c.setSaga(sagaMap.get(node.path("sagaSlug").asText("multiverse-saga")));
                        String pSlug = node.path("phaseSlug").asText(null);
                        if (pSlug != null && phaseMap.containsKey(pSlug)) {
                            c.setPhase(phaseMap.get(pSlug));
                        }

                        Content saved = contentRepository.save(c);
                        contentMap.put(slug, saved);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to seed content from marvel_content.json: {}", e.getMessage(), e);
        }

        // 7. Seed TV Episodes
        Content loki = contentMap.get("loki-season-1");
        if (loki != null) {
            seedLokiEpisodes(loki);
        }
        Content wandaVision = contentMap.get("wandavision");
        if (wandaVision != null) {
            seedWandaVisionEpisodes(wandaVision);
        }

        // 8. Seed Graph Linkages & Cinematic Relationships
        linkRelationships(contentMap);

        // 9. Seed Disney+ Streaming Availability
        if (dplus != null) {
            for (Content c : contentMap.values()) {
                if (c.getUniverse() != null && "mcu".equals(c.getUniverse().getSlug())) {
                    platformAvailabilityRepository.save(new PlatformAvailability(c, dplus, "US", "https://www.disneyplus.com/movies/" + c.getSlug(), true, "4K UHD, HDR10, IMAX Enhanced"));
                }
            }
        }
    }

    /**
     * Automatic synchronization for new future movies.
     * Ensures any newly announced movies added to marvel_content.json
     * are automatically persisted without wiping existing user history.
     */
    public void syncMissingContentFromJson() {
        try {
            ClassPathResource resource = new ClassPathResource("data/marvel_content.json");
            if (!resource.exists()) return;

            Franchise marvel = franchiseRepository.findBySlug("marvel").orElse(null);
            if (marvel == null) return;

            Map<String, Universe> universeMap = new HashMap<>();
            universeRepository.findAll().forEach(u -> universeMap.put(u.getSlug(), u));

            Map<String, Timeline> timelineMap = new HashMap<>();
            timelineRepository.findAll().forEach(t -> timelineMap.put(t.getSlug(), t));

            Map<String, Saga> sagaMap = new HashMap<>();
            sagaRepository.findAll().forEach(s -> sagaMap.put(s.getSlug(), s));

            Map<String, Phase> phaseMap = new HashMap<>();
            phaseRepository.findAll().forEach(p -> phaseMap.put(p.getSlug(), p));

            try (InputStream is = resource.getInputStream()) {
                JsonNode root = new ObjectMapper().readTree(is);
                int added = 0;
                int updated = 0;
                for (JsonNode node : root) {
                    String slug = node.path("slug").asText();
                    Optional<Content> existing = contentRepository.findBySlug(slug);
                    if (existing.isEmpty()) {
                        Content c = new Content();
                        c.setTitle(node.path("title").asText());
                        c.setOriginalTitle(node.path("originalTitle").asText(c.getTitle()));
                        c.setSlug(slug);
                        c.setContentType(ContentType.valueOf(node.path("contentType").asText("MOVIE")));
                        c.setStatus(ContentStatus.valueOf(node.path("status").asText("RELEASED")));
                        if (node.hasNonNull("releaseDate") && !node.path("releaseDate").asText().isEmpty()) {
                            c.setReleaseDate(LocalDate.parse(node.path("releaseDate").asText()));
                        }
                        c.setReleaseYear(node.path("releaseYear").asInt());
                        c.setRuntimeMinutes(node.path("runtimeMinutes").asInt());
                        c.setRating(node.path("rating").asText());
                        c.setGenres(node.path("genres").asText());
                        c.setShortSynopsis(node.path("shortSynopsis").asText());
                        c.setFullSynopsis(node.path("fullSynopsis").asText());
                        c.setDirector(node.path("director").asText());
                        c.setWriters(node.path("writers").asText());
                        c.setCastMembers(node.path("castMembers").asText());
                        c.setProductionStudio(node.path("productionStudio").asText("Marvel Studios"));
                        c.setPosterUrl(node.path("posterUrl").asText());
                        c.setBackdropUrl(node.path("backdropUrl").asText());
                        c.setReleaseOrderNum(node.hasNonNull("releaseOrderNum") ? node.path("releaseOrderNum").asInt() : null);
                        c.setChronologicalOrderNum(node.hasNonNull("chronologicalOrderNum") ? node.path("chronologicalOrderNum").asInt() : null);
                        c.setTimelineOrderNum(node.hasNonNull("timelineOrderNum") ? node.path("timelineOrderNum").asInt() : null);
                        c.setHasSpoilers(node.path("hasSpoilers").asBoolean(false));
                        c.setPostCreditScene(node.hasNonNull("postCreditScene") ? node.path("postCreditScene").asText() : null);
                        c.setIsPublished(true);

                        c.setFranchise(marvel);
                        c.setUniverse(universeMap.get(node.path("universeSlug").asText("mcu")));
                        c.setTimeline(timelineMap.get(node.path("timelineSlug").asText("sacred-timeline")));
                        c.setSaga(sagaMap.get(node.path("sagaSlug").asText("multiverse-saga")));
                        String pSlug = node.path("phaseSlug").asText(null);
                        if (pSlug != null && phaseMap.containsKey(pSlug)) {
                            c.setPhase(phaseMap.get(pSlug));
                        }
                        contentRepository.save(c);
                        added++;
                    } else {
                        // Check if poster was an old placeholder and needs official artwork update
                        Content c = existing.get();
                        String jsonPoster = node.path("posterUrl").asText();
                        if (c.getPosterUrl() == null || c.getPosterUrl().contains("unsplash.com")) {
                            c.setPosterUrl(jsonPoster);
                            contentRepository.save(c);
                            updated++;
                        }
                    }
                }
                log.info("Auto-sync completed: {} new releases added, {} posters modernized.", added, updated);
            }
        } catch (Exception e) {
            log.warn("Auto-sync check failed non-fatally: {}", e.getMessage());
        }
    }

    private void linkRelationships(Map<String, Content> m) {
        // Tobey Raimi-Verse Internal & Multiverse Links
        safeLink(m, "spider-man-2002", "spider-man-2-2004", RelationshipType.SEQUEL, "Direct continuation of Peter's journey; Doctor Octopus emerges.");
        safeLink(m, "spider-man-2-2004", "spider-man-3-2007", RelationshipType.SEQUEL, "Symbiote suit and Sandman confrontation.");
        safeLink(m, "spider-man-2002", "spider-man-no-way-home", RelationshipType.PREREQUISITE, "Establishes Norman Osborn (Green Goblin) origin before he is pulled into the MCU.");
        safeLink(m, "spider-man-2-2004", "spider-man-no-way-home", RelationshipType.PREREQUISITE, "Establishes Otto Octavius (Doc Ock) fusion reactor before he is pulled into the MCU.");
        safeLink(m, "spider-man-3-2007", "spider-man-no-way-home", RelationshipType.PREREQUISITE, "Establishes Flint Marko (Sandman) backstory.");

        // Andrew Webb-Verse Internal & Multiverse Links
        safeLink(m, "the-amazing-spider-man-2012", "the-amazing-spider-man-2-2014", RelationshipType.SEQUEL, "Continuation into Gwen Stacy's graduation and Electro's creation.");
        safeLink(m, "the-amazing-spider-man-2012", "spider-man-no-way-home", RelationshipType.PREREQUISITE, "Establishes Dr. Curt Connors (The Lizard) before he is pulled into the MCU.");
        safeLink(m, "the-amazing-spider-man-2-2014", "spider-man-no-way-home", RelationshipType.PREREQUISITE, "Establishes Max Dillon (Electro) transformation and the tragic loss of Gwen Stacy.");

        // Fox X-Men Universe Complete Linkages
        safeLink(m, "x-men-first-class-2011", "x-men-days-of-future-past-2014", RelationshipType.SEQUEL, "Charles and Erik's 1962 foundation directly informs the 1973 mission to stop the Sentinels.");
        safeLink(m, "x-men-days-of-future-past-2014", "x-men-apocalypse-2016", RelationshipType.SEQUEL, "The rewritten timeline leads to the 1983 awakening of ancient mutant En Sabah Nur.");
        safeLink(m, "x-men-apocalypse-2016", "dark-phoenix-2019", RelationshipType.SEQUEL, "Jean Grey's emergent cosmic powers in 1983 erupt into the 1992 Phoenix crisis.");
        safeLink(m, "x-men-origins-wolverine-2009", "x-men-2000", RelationshipType.PREQUEL, "Logan's Weapon X adamantium bonding leads into his discovery by Professor X.");
        safeLink(m, "x-men-2000", "x2-2003", RelationshipType.SEQUEL, "William Stryker launches an assault on Xavier's School; Jean Grey sacrifices herself at Alkali Lake.");
        safeLink(m, "x2-2003", "x-men-the-last-stand-2006", RelationshipType.SEQUEL, "The mutant cure emerges and Jean Grey returns as the Dark Phoenix.");
        safeLink(m, "x-men-the-last-stand-2006", "the-wolverine-2013", RelationshipType.SEQUEL, "Haunted by Jean's death, Logan travels to Tokyo and faces mortality.");
        safeLink(m, "the-wolverine-2013", "logan-2017", RelationshipType.CONNECTED, "Logan's declining healing factor and the extinction of mutantkind in 2029.");
        safeLink(m, "logan-2017", "the-new-mutants-2020", RelationshipType.CONNECTED, "Transigen and Essex Corporation genetic programs continue at Milbury Hospital.");
        safeLink(m, "x-men-2000", "deadpool-2016", RelationshipType.CONNECTED, "Shared Fox mutant continuum; Wade visits the X-Mansion.");
        safeLink(m, "deadpool-2016", "deadpool-2-2018", RelationshipType.SEQUEL, "Wade forms X-Force and meets Cable.");
        safeLink(m, "deadpool-2016", "logan-2017", RelationshipType.CONNECTED, "The bleak future timeline of mutant extinction.");
        safeLink(m, "x-men-2000", "deadpool-and-wolverine", RelationshipType.PREREQUISITE, "Origin of Hugh Jackman's Wolverine and the Fox mutant franchise.");
        safeLink(m, "logan-2017", "deadpool-and-wolverine", RelationshipType.PREREQUISITE, "The emotional death of Wolverine as Earth-10005's anchor being drives Deadpool into the Void.");
        safeLink(m, "deadpool-2-2018", "deadpool-and-wolverine", RelationshipType.PREREQUISITE, "Wade uses Cable's time travel device, attracting the attention of the TVA.");

        // Core MCU Sacred Timeline Flow
        safeLink(m, "captain-america-the-first-avenger", "captain-marvel", RelationshipType.NEXT_WATCH, "The cosmic and military origins of the Marvel Cinematic Universe.");
        safeLink(m, "captain-marvel", "iron-man", RelationshipType.NEXT_WATCH, "Nick Fury initiates the Avengers protocol after encountering Carol Danvers.");
        safeLink(m, "iron-man", "the-incredible-hulk", RelationshipType.NEXT_WATCH, "Tony Stark approaches General Ross about putting a team together.");
        safeLink(m, "iron-man", "iron-man-2", RelationshipType.SEQUEL, "Direct continuation of Tony Stark's journey as Iron Man.");
        safeLink(m, "iron-man-2", "thor", RelationshipType.NEXT_WATCH, "Leads directly to the discovery of Mjolnir in New Mexico.");
        safeLink(m, "thor", "the-avengers", RelationshipType.PREREQUISITE, "Loki's backstory and the Tesseract setup for Earth's Mightiest Heroes.");
        safeLink(m, "the-avengers", "iron-man-3", RelationshipType.NEXT_WATCH, "Tony Stark struggles with PTSD following the Battle of New York.");
        safeLink(m, "the-avengers", "thor-the-dark-world", RelationshipType.NEXT_WATCH, "Thor returns to Asgard with Loki and encounters the Reality Stone (Aether).");
        safeLink(m, "the-avengers", "captain-america-the-winter-soldier", RelationshipType.NEXT_WATCH, "Fallout of S.H.I.E.L.D. after the Battle of New York.");
        safeLink(m, "captain-america-the-winter-soldier", "guardians-of-the-galaxy", RelationshipType.NEXT_WATCH, "Expands the cosmic front of the Power Stone.");
        safeLink(m, "guardians-of-the-galaxy", "guardians-of-the-galaxy-vol-2", RelationshipType.SEQUEL, "Peter Quill discovers his Celestial parentage.");
        safeLink(m, "guardians-of-the-galaxy-vol-2", "the-guardians-of-the-galaxy-holiday-special", RelationshipType.NEXT_WATCH, "Mantis and Drax celebrate on Knowhere.");
        safeLink(m, "the-guardians-of-the-galaxy-holiday-special", "guardians-of-the-galaxy-vol-3", RelationshipType.SEQUEL, "Rocket Raccoon's emotional confrontation with the High Evolutionary.");
        safeLink(m, "captain-america-the-winter-soldier", "avengers-age-of-ultron", RelationshipType.NEXT_WATCH, "Avengers raid the final Hydra research stronghold.");
        safeLink(m, "avengers-age-of-ultron", "ant-man", RelationshipType.NEXT_WATCH, "Scott Lang infiltrates the new Avengers facility.");
        safeLink(m, "ant-man", "ant-man-and-the-wasp", RelationshipType.SEQUEL, "Rescue of Janet van Dyne from the Quantum Realm.");
        safeLink(m, "ant-man-and-the-wasp", "ant-man-and-the-wasp-quantumania", RelationshipType.SEQUEL, "Exploration of the Quantum Realm empire of Kang.");
        safeLink(m, "avengers-age-of-ultron", "captain-america-civil-war", RelationshipType.NEXT_WATCH, "Sokovia Accords divide the Avengers.");
        safeLink(m, "captain-america-civil-war", "black-widow", RelationshipType.NEXT_WATCH, "Natasha Romanoff on the run dismantles the Red Room.");
        safeLink(m, "captain-america-civil-war", "spider-man-homecoming", RelationshipType.NEXT_WATCH, "Peter Parker returns to Queens after the Germany airport battle.");
        safeLink(m, "captain-america-civil-war", "black-panther", RelationshipType.NEXT_WATCH, "T'Challa returns to sovereign Wakanda following King T'Chaka's death.");
        safeLink(m, "black-panther", "black-panther-wakanda-forever", RelationshipType.SEQUEL, "Wakanda mourns King T'Challa and faces the threat of Namor.");
        safeLink(m, "black-panther-wakanda-forever", "ironheart", RelationshipType.SPIN_OFF, "Riri Williams takes her technology back to Chicago.");
        safeLink(m, "black-panther-wakanda-forever", "black-panther-3", RelationshipType.SEQUEL, "Wakanda enters the post-Secret Wars era.");
        safeLink(m, "captain-america-civil-war", "doctor-strange", RelationshipType.NEXT_WATCH, "Stephen Strange discovers the mystic arts and the Time Stone.");
        safeLink(m, "doctor-strange", "thor-ragnarok", RelationshipType.NEXT_WATCH, "Thor seeks Strange's guidance in locating Odin.");
        safeLink(m, "thor-ragnarok", "avengers-infinity-war", RelationshipType.PREREQUISITE, "Thanos' warship intercepts the Asgardian refugee fleet.");
        safeLink(m, "thor-ragnarok", "thor-love-and-thunder", RelationshipType.SEQUEL, "Thor reunites with Jane Foster wielding reformed Mjolnir.");
        safeLink(m, "black-panther", "avengers-infinity-war", RelationshipType.NEXT_WATCH, "Wakanda opens its borders and serves as the final battlefield against Thanos.");
        safeLink(m, "avengers-infinity-war", "avengers-endgame", RelationshipType.SEQUEL, "Direct second half of the Thanos culmination event.");
        safeLink(m, "avengers-endgame", "loki-season-1", RelationshipType.SPIN_OFF, "Loki escapes with the 2012 Tesseract during Endgame's Time Heist.");
        safeLink(m, "loki-season-1", "loki-season-2", RelationshipType.SEQUEL, "Loki reweaves the temporal loom into Yggdrasil.");
        safeLink(m, "loki-season-2", "deadpool-and-wolverine", RelationshipType.CONNECTED, "Deadpool enters the TVA and the Multiverse Void.");
        safeLink(m, "avengers-endgame", "wandavision", RelationshipType.NEXT_WATCH, "Explores Wanda's grief after losing Vision in Infinity War.");
        safeLink(m, "wandavision", "agatha-all-along", RelationshipType.SPIN_OFF, "Agatha Harkness breaks free and walks the Witches' Road.");
        safeLink(m, "wandavision", "visionquest", RelationshipType.SPIN_OFF, "White Vision searches for his lost humanity and memories.");
        safeLink(m, "wandavision", "doctor-strange-in-the-multiverse-of-madness", RelationshipType.PREREQUISITE, "Wanda's corruption by the Darkhold leads directly into the multiverse incursion.");
        safeLink(m, "avengers-endgame", "the-falcon-and-the-winter-soldier", RelationshipType.NEXT_WATCH, "Sam Wilson accepts the shield of Captain America.");
        safeLink(m, "the-falcon-and-the-winter-soldier", "captain-america-brave-new-world", RelationshipType.SEQUEL, "Sam Wilson confronts President Ross / Red Hulk.");
        safeLink(m, "the-falcon-and-the-winter-soldier", "thunderbolts", RelationshipType.CONNECTED, "Bucky Barnes and John Walker join the anti-hero strike force.");
        safeLink(m, "avengers-endgame", "spider-man-far-from-home", RelationshipType.NEXT_WATCH, "Peter steps up as Europe's protector following Tony Stark's death.");
        safeLink(m, "spider-man-homecoming", "spider-man-far-from-home", RelationshipType.SEQUEL, "Peter travels to Europe and battles Mysterio.");
        safeLink(m, "spider-man-far-from-home", "spider-man-no-way-home", RelationshipType.PREREQUISITE, "Mysterio exposes Peter Parker's identity.");
        safeLink(m, "spider-man-no-way-home", "spider-man-brand-new-day", RelationshipType.NEXT_WATCH, "The world forgets Peter Parker; Peter starts fresh as a street-level hero.");
        safeLink(m, "daredevil-born-again-season-1", "daredevil-born-again-season-2", RelationshipType.SEQUEL, "The war for New York City against Wilson Fisk.");
        safeLink(m, "daredevil-born-again-season-2", "the-punisher-special-presentation", RelationshipType.SPIN_OFF, "Frank Castle's standalone mission.");
        safeLink(m, "daredevil-born-again-season-2", "spider-man-brand-new-day", RelationshipType.CONNECTED, "NYC street-level alliance against Kingpin's anti-vigilante mayoral laws.");
        safeLink(m, "spider-man-brand-new-day", "avengers-doomsday", RelationshipType.NEXT_WATCH, "Peter Parker is drawn from street-level New York into the cosmic incursion crisis.");
        safeLink(m, "the-fantastic-four-first-steps", "avengers-doomsday", RelationshipType.NEXT_WATCH, "Marvel's First Family crosses over from their dimension into Earth-616.");
        safeLink(m, "avengers-doomsday", "daredevil-born-again-season-3", RelationshipType.NEXT_WATCH, "Post-Doomsday street-level aftermath.");
        safeLink(m, "avengers-doomsday", "avengers-secret-wars", RelationshipType.SEQUEL, "Part two of the Multiverse Saga finale where incursions collapse all worlds onto Battleworld.");
        safeLink(m, "avengers-secret-wars", "ghost-rider-2028", RelationshipType.CONNECTED, "Occult and supernatural powers resurface in the restructured post-Secret Wars timeline.");
        safeLink(m, "werewolf-by-night", "ghost-rider-2028", RelationshipType.PREREQUISITE, "Introduces the Bloodstone relic, laying ground for the Midnight Sons.");
        safeLink(m, "avengers-secret-wars", "x-men-2028", RelationshipType.CONNECTED, "Mutant species officially integrate into the prime Marvel continuity.");
        safeLink(m, "avengers-secret-wars", "black-panther-3", RelationshipType.CONNECTED, "Wakanda's kingdom navigates the new world order following Battleworld.");
    }

    private void safeLink(Map<String, Content> map, String srcSlug, String tgtSlug, RelationshipType type, String notes) {
        Content src = map.get(srcSlug);
        Content tgt = map.get(tgtSlug);
        if (src != null && tgt != null) {
            relationshipRepository.save(new ContentRelationship(src, tgt, type, notes));
        }
    }

    private void seedLokiEpisodes(Content loki) {
        Season s1 = seasonRepository.save(new Season(loki, 1, "Season 1", 6, 2021));
        episodeRepository.save(new Episode(s1, 1, "Glorious Purpose", 51, LocalDate.of(2021, 6, 9), "Loki lands in the mysterious Time Variance Authority after escaping with the Tesseract."));
        episodeRepository.save(new Episode(s1, 2, "The Variant", 54, LocalDate.of(2021, 6, 16), "Mobius puts Loki to work, but not everyone at the TVA is thrilled by the God of Mischief's presence."));
        episodeRepository.save(new Episode(s1, 3, "Lamentis", 42, LocalDate.of(2021, 6, 23), "Loki finds out about The Variant's plans, but has his own game in mind that will alter both of their destinies."));
        episodeRepository.save(new Episode(s1, 4, "The Nexus Event", 48, LocalDate.of(2021, 6, 30), "Frayed nerves and paranoia seep through the TVA as Mobius and Hunter B-15 search for Loki and Sylvie."));
        episodeRepository.save(new Episode(s1, 5, "Journey Into Mystery", 49, LocalDate.of(2021, 7, 7), "Loki navigates the Void at the end of time alongside alternate variants, including Classic Loki and Alligator Loki."));
        episodeRepository.save(new Episode(s1, 6, "For All Time. Always.", 54, LocalDate.of(2021, 7, 14), "The clock is ticking in the season finale as Loki and Sylvie confront He Who Remains at the Citadel."));

        Season s2 = seasonRepository.save(new Season(loki, 2, "Season 2", 6, 2023));
        episodeRepository.save(new Episode(s2, 1, "Ouroboros", 47, LocalDate.of(2023, 10, 5), "Loki finds himself slipping through time across the past, present, and future of the TVA."));
        episodeRepository.save(new Episode(s2, 2, "Breaking Brad", 49, LocalDate.of(2023, 10, 12), "Loki and Mobius search for Sylvie on a branch timeline while interrogating Hunter X-5."));
        episodeRepository.save(new Episode(s2, 3, "1893", 53, LocalDate.of(2023, 10, 19), "Loki and Mobius track Ravonna Renslayer and Miss Minutes to the 1893 World's Fair in Chicago to find Victor Timely."));
        episodeRepository.save(new Episode(s2, 4, "Heart of the TVA", 48, LocalDate.of(2023, 10, 26), "The Temporal Loom nears catastrophic failure as the team attempts to expand its throughput."));
        episodeRepository.save(new Episode(s2, 5, "Science/Fiction", 45, LocalDate.of(2023, 11, 2), "Loki time-slips between the alternate lives of his friends across scattered branches."));
        episodeRepository.save(new Episode(s2, 6, "Glorious Purpose", 56, LocalDate.of(2023, 11, 9), "Loki spends centuries mastering quantum mechanics to reweave the dying loom into the living tree of time."));
    }

    private void seedWandaVisionEpisodes(Content wv) {
        Season s1 = seasonRepository.save(new Season(wv, 1, "Limited Series", 9, 2021));
        episodeRepository.save(new Episode(s1, 1, "Filmed Before a Live Studio Audience", 30, LocalDate.of(2021, 1, 15), "Wanda and Vision try to conceal their powers during a dinner with Vision's boss in a 1950s sitcom."));
        episodeRepository.save(new Episode(s1, 2, "Don't Touch That Dial", 37, LocalDate.of(2021, 1, 15), "Attempting to fit in, Wanda and Vision perform a magic act in their 1960s neighborhood talent show."));
        episodeRepository.save(new Episode(s1, 3, "Now in Color", 33, LocalDate.of(2021, 1, 22), "Wanda's pregnancy moves at lightning speed in a vibrant 1970s Brady Bunch-inspired world."));
        episodeRepository.save(new Episode(s1, 4, "We Interrupt This Program", 36, LocalDate.of(2021, 1, 29), "Monica Rambeau returns from the Blip and discovers the anomaly surrounding Westview with S.W.O.R.D."));
        episodeRepository.save(new Episode(s1, 5, "On a Very Special Episode...", 42, LocalDate.of(2021, 2, 5), "Vision begins suspecting the neighbors' behavior in an 1980s family comedy; an unexpected Pietro arrives."));
        episodeRepository.save(new Episode(s1, 6, "All-New Halloween Spooktacular!", 38, LocalDate.of(2021, 2, 12), "Disturbances unravel the Halloween festivities in a late 1990s Malcolm in the Middle homage."));
        episodeRepository.save(new Episode(s1, 7, "Breaking the Fourth Wall", 38, LocalDate.of(2021, 2, 19), "Wanda navigates modern mockumentary complications as Agnes reveals her true identity as Agatha Harkness."));
        episodeRepository.save(new Episode(s1, 8, "Previously On", 47, LocalDate.of(2021, 2, 26), "Agatha leads Wanda on a journey through her traumatic memories to unlock the source of Chaos Magic."));
        episodeRepository.save(new Episode(s1, 9, "The Series Finale", 50, LocalDate.of(2021, 3, 5), "Wanda embraces her destiny as the Scarlet Witch in an epic confrontation with Agatha and White Vision."));
    }
}

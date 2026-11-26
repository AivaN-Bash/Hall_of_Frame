package com.halloffame.service;

import com.halloffame.config.AppProperties;
import com.halloffame.entity.SiteSettingsEntity;
import com.halloffame.entity.UserEntity;
import com.halloffame.repository.SiteSettingsRepository;
import com.halloffame.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(1)
public class AdminBootstrapService implements ApplicationRunner {

    private final UserRepository userRepository;
    private final SiteSettingsRepository siteSettingsRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppProperties properties;

    public AdminBootstrapService(
        UserRepository userRepository,
        SiteSettingsRepository siteSettingsRepository,
        PasswordEncoder passwordEncoder,
        AppProperties properties
    ) {
        this.userRepository = userRepository;
        this.siteSettingsRepository = siteSettingsRepository;
        this.passwordEncoder = passwordEncoder;
        this.properties = properties;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        String username = properties.admin().username();
        String password = properties.admin().password();
        if (username != null && !username.isBlank() && password != null && !password.isBlank()) {
            userRepository.findByUsername(username).orElseGet(() -> {
                UserEntity admin = new UserEntity();
                admin.setUsername(username);
                admin.setPasswordHash(passwordEncoder.encode(password));
                admin.setRole("ADMIN");
                return userRepository.save(admin);
            });
        }

        if (siteSettingsRepository.findById((short) 1).isEmpty()) {
            SiteSettingsEntity defaults = new SiteSettingsEntity();
            defaults.setId((short) 1);
            defaults.setSiteName("Hall of Fame");
            defaults.setGreeting("Hey, I'm");
            defaults.setHeroName("Phawat");
            defaults.setHeroBio("A living archive of the series, films, anime, games, and albums that stayed with me—and why.");
            defaults.setPortraitUrl("");
            defaults.setAboutBio("Collector of unforgettable worlds, needle-drops, and stories that refuse to leave my head.");
            defaults.setAboutPurpose("I built this Hall of Fame so my favourite media lives in one calm, personal space instead of scattered lists.");
            defaults.setCurrentlyWatchingPlaying("Rewatching DARK, listening to late-night synth soundtracks, and curating new entries.");
            siteSettingsRepository.save(defaults);
        }
    }
}

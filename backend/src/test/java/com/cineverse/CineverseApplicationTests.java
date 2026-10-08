package com.cineverse;

import com.cineverse.model.entity.Franchise;
import com.cineverse.repository.ContentRepository;
import com.cineverse.repository.FranchiseRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CineverseApplicationTests {

    @Autowired
    private FranchiseRepository franchiseRepository;

    @Autowired
    private ContentRepository contentRepository;

    @Test
    void contextLoadsAndSeedsData() {
        List<Franchise> franchises = franchiseRepository.findAll();
        assertFalse(franchises.isEmpty(), "Franchises should be seeded");
        assertTrue(franchises.stream().anyMatch(f -> "marvel".equals(f.getSlug())), "Marvel franchise should exist");
        assertTrue(franchises.stream().anyMatch(f -> "star-wars".equals(f.getSlug())), "Star Wars franchise should exist");
        assertTrue(franchises.stream().anyMatch(f -> "dc".equals(f.getSlug())), "DC franchise should exist");

        long contentCount = contentRepository.count();
        assertTrue(contentCount >= 15, "Should have seeded at least 15 content items, found: " + contentCount);
    }
}

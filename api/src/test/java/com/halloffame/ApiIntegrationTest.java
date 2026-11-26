package com.halloffame;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.halloffame.security.LoginRateLimitFilter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles({"dev", "test"})
class ApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private LoginRateLimitFilter rateLimitFilter;

    @BeforeEach
    void resetRateLimit() {
        rateLimitFilter.reset();
    }

    @Test
    void publicEndpointsReturnSeededSiteCategoriesAndDarkFirst() throws Exception {
        mockMvc.perform(get("/api/site"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.siteName").value("Hall of Fame"))
            .andExpect(jsonPath("$.entryCount", greaterThanOrEqualTo(8)));

        mockMvc.perform(get("/api/categories"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").value("Series"))
            .andExpect(jsonPath("$[0].entries[0].title").value("DARK"));

        mockMvc.perform(get("/api/entries/dark"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("DARK"))
            .andExpect(jsonPath("$.tier").value("S"))
            .andExpect(jsonPath("$.tags", hasSize(greaterThanOrEqualTo(1))))
            .andExpect(jsonPath("$.nextEntry.slug").value("the-queen-s-gambit"))
            .andExpect(jsonPath("$.relatedEntries", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    void entryFilteringSearchAndSortWork() throws Exception {
        mockMvc.perform(get("/api/entries").param("category", "series").param("q", "rain"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].slug").value("dark"));

        mockMvc.perform(get("/api/entries").param("tag", "fantasy").param("sort", "rating"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(2))))
            .andExpect(jsonPath("$[0].rating", greaterThanOrEqualTo(9.5)));
    }

    @Test
    void writeEndpointsRequireAdminJwt() throws Exception {
        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Music\"}"))
            .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/entries")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"categoryId\":1,\"title\":\"Test\",\"tier\":\"S\",\"whyHooked\":\"Great\"}"))
            .andExpect(status().isUnauthorized());

        mockMvc.perform(put("/api/site")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void adminCanCrudEntriesAndCategories() throws Exception {
        String token = loginAndGetToken();

        MvcResult createdCat = mockMvc.perform(post("/api/categories")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Music\",\"sortOrder\":10,\"artSeed\":42}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.slug").value("music"))
            .andReturn();

        long catId = objectMapper.readTree(createdCat.getResponse().getContentAsString()).get("id").asLong();

        String entryBody = """
            {
              "categoryId": %d,
              "title": "Random Access Memories",
              "releaseYear": 2013,
              "accentColor": "#a678a2",
              "tagline": "Warm analog disco craftsmanship.",
              "rating": 9.4,
              "tier": "S",
              "whyHooked": "Every track sounds timeless and tactile.",
              "favoriteMoment": "The vocoder breakdown in Touch.",
              "favoriteQuoteOrChar": "Giorgio by Moroder",
              "featured": false,
              "rankOrder": 1,
              "tags": ["electronic", "album"]
            }
            """.formatted(catId);

        MvcResult createdEntry = mockMvc.perform(post("/api/entries")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(entryBody))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.slug").value("random-access-memories"))
            .andExpect(jsonPath("$.tags", hasSize(2)))
            .andReturn();

        long entryId = objectMapper.readTree(createdEntry.getResponse().getContentAsString()).get("id").asLong();

        String updateBody = """
            {
              "categoryId": %d,
              "title": "Random Access Memories",
              "releaseYear": 2013,
              "accentColor": "#e0c2d5",
              "tagline": "Updated tagline",
              "rating": 9.6,
              "tier": "S",
              "whyHooked": "Still timeless.",
              "featured": true,
              "rankOrder": 2,
              "tags": ["electronic"]
            }
            """.formatted(catId);

        mockMvc.perform(put("/api/entries/" + entryId)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.featured").value(true))
            .andExpect(jsonPath("$.tags", hasSize(1)));

        mockMvc.perform(delete("/api/entries/" + entryId)
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isNoContent());

        mockMvc.perform(delete("/api/categories/" + catId)
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isNoContent());
    }

    @Test
    void uploadValidatesImageMagicBytesAndServesUploadedFile() throws Exception {
        String token = loginAndGetToken();

        MockMultipartFile badFile = new MockMultipartFile(
            "file",
            "notes.txt",
            "text/plain",
            "not an image".getBytes()
        );
        mockMvc.perform(multipart("/api/uploads")
                .file(badFile)
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isBadRequest());

        byte[] minimalPng = new byte[] {
            (byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52
        };
        MockMultipartFile pngFile = new MockMultipartFile(
            "file",
            "poster.png",
            "image/png",
            minimalPng
        );
        MvcResult uploaded = mockMvc.perform(multipart("/api/uploads")
                .file(pngFile)
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.url", startsWith("/api/uploads/")))
            .andReturn();

        String url = objectMapper.readTree(uploaded.getResponse().getContentAsString()).get("url").asText();
        mockMvc.perform(get(url))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.IMAGE_PNG));
    }

    @Test
    void loginEndpointIsRateLimited() throws Exception {
        String badBody = "{\"username\":\"testadmin\",\"password\":\"wrong\"}";
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(badBody))
                .andExpect(status().isUnauthorized());
        }
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(badBody))
            .andExpect(status().isTooManyRequests());
    }

    private String loginAndGetToken() throws Exception {
        MvcResult res = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testadmin\",\"password\":\"test-password-123\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").isNotEmpty())
            .andReturn();
        JsonNode json = objectMapper.readTree(res.getResponse().getContentAsString());
        String token = json.get("token").asText();

        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.role").value("ADMIN"));

        return token;
    }
}

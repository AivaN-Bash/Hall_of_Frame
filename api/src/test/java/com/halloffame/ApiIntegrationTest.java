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
            .andExpect(jsonPath("$.tags", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    void writeEndpointsRequireAdminJwt() throws Exception {
        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Music\"}"))
            .andExpect(status().isUnauthorized());

        String token = loginAndGetToken();

        MvcResult createdCat = mockMvc.perform(post("/api/categories")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Music\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.slug").value("music"))
            .andReturn();

        long catId = objectMapper.readTree(createdCat.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(delete("/api/categories/" + catId)
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isNoContent());
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

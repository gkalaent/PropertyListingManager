package gr.kalaentzis.projectlistingmanager.controller;

import gr.kalaentzis.projectlistingmanager.model.User;

import org.json.JSONException;
import org.json.JSONObject;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
public class AuthControllerTests {

    private static String authUrl;
    private static RestTemplate restTemplate;
    private static HttpHeaders headers;

    private static JSONObject validUserJson;
    private static JSONObject invalidUserJson;

    @BeforeAll
    public static void runBeforeTests() throws JSONException {
        authUrl = "http://localhost:8080/auth";

        restTemplate = new RestTemplate();
        headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Valid credentials
        validUserJson = new JSONObject();
        validUserJson.put("username", "spitogatos");
        validUserJson.put("password", "pass");

        // Invalid credentials
        invalidUserJson = new JSONObject();
        invalidUserJson.put("username", "spitogatos");
        invalidUserJson.put("password", "wrongPassword");
    }


    /**
     * Test valid user authorization
     */
    @Test
    public void testValidAuth() {
        HttpEntity<String> request = new HttpEntity<String>(validUserJson.toString(), headers);

        User user = restTemplate.postForObject(authUrl, request, User.class);

        // When the credentials are valid, the user and their listings are returned
        assertNotNull(user);

        // Assert that the user returned has the correct credentials
        assertEquals(user.getUsername(), "spitogatos");
        assertEquals(user.getPassword(), "pass");

    }

    /**
     * Test invalid user authorization
     */
    @Test
    public void testInvalidAuth() {
        HttpEntity<String> request = new HttpEntity<String>(invalidUserJson.toString(), headers);

        // An invalid user  receives an UNAUTHORIZED status code
        // RestTemplate throws an Unauthorized exception when it receives this status code
        assertThrows(HttpClientErrorException.Unauthorized.class, () -> {
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(authUrl, request, String.class);
        });

    }

}

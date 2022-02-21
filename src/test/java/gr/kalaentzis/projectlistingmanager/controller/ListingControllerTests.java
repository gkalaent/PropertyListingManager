package gr.kalaentzis.projectlistingmanager.controller;

import gr.kalaentzis.projectlistingmanager.model.Listing;
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

@SpringBootTest( webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
public class ListingControllerTests {


    private static String authUrl;
    private static String listingUrl;
    private static RestTemplate restTemplate;
    private static HttpHeaders headers;

    private static JSONObject firstUserJson;
    private static JSONObject secondUserJson;

    private static User firstUser;
    private static User secondUser;

    @BeforeAll
    public static void runBeforeTests() throws JSONException {
        authUrl = "http://localhost:8080/auth";
        listingUrl = "http://localhost:8080/listings";

        restTemplate = new RestTemplate();
        headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // First user
        firstUserJson = new JSONObject();
        firstUserJson.put("username", "spitogatos");
        firstUserJson.put("password", "pass");

        // Second user
        secondUserJson = new JSONObject();
        secondUserJson.put("username", "kalaentzis");
        secondUserJson.put("password", "123");

        // Authorize both users once instead of each test method
        // Login for first user
        HttpEntity<String> request = new HttpEntity<String>(firstUserJson.toString(), headers);
        firstUser = restTemplate.postForObject(authUrl, request, User.class);
        assertNotNull(firstUser);

        // Login for second user
        request = new HttpEntity<String>(secondUserJson.toString(), headers);
        secondUser = restTemplate.postForObject(authUrl, request, User.class);
        assertNotNull(secondUser);

    }


    /**
     * Test for the listings of each user. At startup, first user has two listings and the second none
     */
    @Test
    public void testUserListings() {
        // Listings for each user are returned with a successful login

        // Assert that first user has two listings
        assertEquals(firstUser.getListings().size(), 2);

        // Assert that second user has no listings
        assertEquals(secondUser.getListings().size(), 0);
    }

    /**
     * Test invalid listing
     */
    @Test
    public void testInvalidListing() throws JSONException {
        JSONObject listingJson = new JSONObject();
        listingJson.put("city", "invalid");
        listingJson.put("price", "650");
        listingJson.put("availability", "Ενοικίαση");
        listingJson.put("area", 100);

        // Invalid City
        assertThrows(HttpClientErrorException.BadRequest.class, () -> {
            HttpEntity<String> request = new HttpEntity<String>(listingJson.toString(), headers);
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(listingUrl +
                    "/" + firstUser.getId(), request, String.class);
        });


        // Fix city
        listingJson.put("city", "Αθήνα");

        // Invalid price
        listingJson.put("price", "-10");
        assertThrows(HttpClientErrorException.BadRequest.class, () -> {
            HttpEntity<String> request = new HttpEntity<String>(listingJson.toString(), headers);
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(listingUrl +
                    "/" + firstUser.getId(), request, String.class);
        });

        // Fix price
        listingJson.put("price", "650");

        // Invalid availability
        listingJson.put("availability", "invalid");
        assertThrows(HttpClientErrorException.BadRequest.class, () -> {
            HttpEntity<String> request = new HttpEntity<String>(listingJson.toString(), headers);
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(listingUrl +
                    "/" + firstUser.getId(), request, String.class);
        });

        // Fix availability
        listingJson.put("availability", "Ενοικίαση");

        // Invalid area
        listingJson.put("area", 4000);
        assertThrows(HttpClientErrorException.BadRequest.class, () -> {
            HttpEntity<String> request = new HttpEntity<String>(listingJson.toString(), headers);
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(listingUrl +
                    "/" + firstUser.getId(), request, String.class);
        });


    }

    /**
     * Test add/remove listing for one user
     */
    @Test
    public void testAddRemoveSimple() throws JSONException {
        JSONObject listingJson = new JSONObject();
        listingJson.put("city", "Αθήνα");
        listingJson.put("price", "650");
        listingJson.put("availability", "Ενοικίαση");
        listingJson.put("area", 100);

        // Send Request to add new listing
        HttpEntity<String> request = new HttpEntity<String>(listingJson.toString(), headers);
        Listing listing = restTemplate.postForObject(listingUrl + "/" + firstUser.getId(), request, Listing.class);

        // Assert that the correct values were returned
        assertNotNull(listing);
        assertEquals(listing.getCity(), "Αθήνα");
        assertEquals(listing.getPrice(), 650);
        assertEquals(listing.getAvailability(), "Ενοικίαση");
        assertEquals(listing.getArea(), 100);

        // Assert that the user's listings were updated
        request = new HttpEntity<String>(firstUserJson.toString(), headers);
        User user = restTemplate.postForObject(authUrl, request, User.class);
        assertEquals(user.getListings().size(), 3);


        // Send Request to delete the new listing
        restTemplate.delete(listingUrl + "/" + firstUser.getId() + "/" + listing.getId());

        // Send Request to delete an already deleted listing
        assertThrows(HttpClientErrorException.BadRequest.class, () -> {
            restTemplate.delete(listingUrl + "/" + firstUser.getId() + "/" + listing.getId());
         });

        // Send Request to delete to an invalid id listing
        assertThrows(HttpClientErrorException.BadRequest.class, () -> {
            restTemplate.delete(listingUrl + "/" + firstUser.getId() + "/" + "2022");
        });

        // Assert that the user's listings were updated
        request = new HttpEntity<String>(firstUserJson.toString(), headers);
        user = restTemplate.postForObject(authUrl, request, User.class);
        assertEquals(user.getListings().size(), 2);

    }

    /**
     * Test add and delete listing for multiple users
     */
    @Test
    public void testAndRemoveAdvanced () throws JSONException {
        JSONObject listingJson = new JSONObject();
        listingJson.put("city", "Πάτρα");
        listingJson.put("price", "1000");
        listingJson.put("availability", "Ενοικίαση");
        listingJson.put("area", 120);

        // Send Request to add new listing
        HttpEntity<String> request = new HttpEntity<String>(listingJson.toString(), headers);
        Listing firstListing = restTemplate.postForObject(listingUrl + "/" + firstUser.getId(), request, Listing.class);

        // Assert that addition was successful
        assertNotNull(firstListing);

        // Assert that first user's listing was updated
        request = new HttpEntity<String>(firstUserJson.toString(), headers);
        firstUser = restTemplate.postForObject(authUrl, request, User.class);
        assertEquals(firstUser.getListings().size(), 3);

        // Assert that second user's listing is still intact
        request = new HttpEntity<String>(secondUserJson.toString(), headers);
        secondUser = restTemplate.postForObject(authUrl, request, User.class);
        assertEquals(secondUser.getListings().size(), 0);


        // Add a listing for the second user
        listingJson.put("city", "Ηράκλειο");
        listingJson.put("price", "80000");
        listingJson.put("availability", "Πώληση");
        listingJson.put("area", 110);
        request = new HttpEntity<String>(listingJson.toString(), headers);
        Listing secondListing = restTemplate.postForObject(listingUrl + "/" + secondUser.getId(), request, Listing.class);

        // Assert that first user's listing is still intact
        request = new HttpEntity<String>(firstUserJson.toString(), headers);
        firstUser = restTemplate.postForObject(authUrl, request, User.class);
        assertEquals(firstUser.getListings().size(), 3);

        // Assert that second user's listing was updated
        request = new HttpEntity<String>(secondUserJson.toString(), headers);
        secondUser = restTemplate.postForObject(authUrl, request, User.class);
        assertEquals(secondUser.getListings().size(), 1);


        // Delete first user's listing
        restTemplate.delete(listingUrl + "/" + firstUser.getId() + "/" + firstListing.getId());

        // Assert that first user's listing was updated
        request = new HttpEntity<String>(firstUserJson.toString(), headers);
        firstUser = restTemplate.postForObject(authUrl, request, User.class);
        assertEquals(firstUser.getListings().size(), 2);

        // Assert that second user's listing is still intact
        request = new HttpEntity<String>(secondUserJson.toString(), headers);
        secondUser = restTemplate.postForObject(authUrl, request, User.class);
        assertEquals(secondUser.getListings().size(), 1);

        // Delete second user's listing
        restTemplate.delete(listingUrl + "/" + secondUser.getId() + "/" + secondListing.getId());

        // Assert that first user's listing is still intact
        request = new HttpEntity<String>(firstUserJson.toString(), headers);
        firstUser = restTemplate.postForObject(authUrl, request, User.class);
        assertEquals(firstUser.getListings().size(), 2);

        // Assert that second user's listing was updated
        request = new HttpEntity<String>(secondUserJson.toString(), headers);
        secondUser = restTemplate.postForObject(authUrl, request, User.class);
        assertEquals(secondUser.getListings().size(), 0);

    }

}

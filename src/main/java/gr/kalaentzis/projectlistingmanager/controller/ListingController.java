package gr.kalaentzis.projectlistingmanager.controller;

import gr.kalaentzis.projectlistingmanager.model.Listing;
import gr.kalaentzis.projectlistingmanager.model.User;
import gr.kalaentzis.projectlistingmanager.repository.ListingRepository;
import gr.kalaentzis.projectlistingmanager.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * This class is an endpoint controller of the system's listings.
 * The controller currently supports GET, POST and DELETE operations.
 */
@RestController
@RequestMapping("/listings")
public class ListingController {

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;

    public ListingController(ListingRepository listingRepository, UserRepository userRepository) {
        this.listingRepository = listingRepository;
        this.userRepository = userRepository;
    }

    /**
     * GET operation that is mapped to the /listings endpoint
     * @return the whole system's listings
     */
    @GetMapping
    public List<Listing> getListings(){
        return listingRepository.findAll();
    }

    /**
     * DELETE operation that is mapped to the /listings/{user_id}/{listing_id} endpoint
     * @param userId The id of the user that owns the listing
     * @param id The listing's id
     * @return OK on success, BAD_REQUEST otherwise
     */
    @DeleteMapping("/{userId}/{id}")
    public ResponseEntity deleteListing(@PathVariable("userId") Long userId, @PathVariable("id") Long id) {
        Optional<User> user = userRepository.findById(userId);
        if(user.isPresent() &&
            listingRepository.existsById(id)) {

            listingRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    /**
     * POST operation that is mapped to the /listings/{user_id} endpoint
     * @param userId The id of the user that owns the listing
     * @param listing The listing, which is sent as the body of the request
     * @return the listing that was added on success, BAD_REQUEST otherwise
     */
    @PostMapping("/{userId}")
    public ResponseEntity addListing(@PathVariable Long userId, @RequestBody Listing listing) {
        Optional<User> user = userRepository.findById(userId);

        if (validateListing(listing) && user.isPresent()) {

            Listing newListing = new Listing(listing.getCity(), listing.getPrice(), listing.getAvailability(), listing.getArea(), user.get());
            listingRepository.save(newListing);
            return ResponseEntity.ok(newListing);
        }
        return ResponseEntity.badRequest().build();
    }

    /**
     * Utility function that check's if the listing is valid.
     * Valid cities: "Αθήνα", "Θεσσαλονίκη", "Πάτρα", "Ηράκλειο"
     * Valid price: 50 - 5.000.000
     * Valid availability: "Πώληση", "Ενοικίαση"
     * Valid area: 20 - 1.000
     * @param listing The listing to be validated
     * @return true if the listing is valid, false otherwise
     */
    private boolean validateListing(Listing listing){
        final List<String> validCities = Arrays.asList("Αθήνα", "Θεσσαλονίκη", "Πάτρα", "Ηράκλειο");
        final List<String> validAvailability = Arrays.asList("Πώληση", "Ενοικίαση");
        Integer price = listing.getPrice();
        Integer area = listing.getArea();

        return validCities.contains(listing.getCity()) &&
                validAvailability.contains(listing.getAvailability()) &&
                (price >= 50 && price <= 5000000) &&
                (area >= 20 && area <= 1000);
    }
}

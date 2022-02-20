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

@RestController
@RequestMapping("/listings")
public class ListingController {

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;

    public ListingController(ListingRepository listingRepository, UserRepository userRepository) {
        this.listingRepository = listingRepository;
        this.userRepository = userRepository;
    }
    @GetMapping
    public List<Listing> getListings(){
        return listingRepository.findAll();
    }

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

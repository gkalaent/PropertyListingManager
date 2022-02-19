package gr.kalaentzis.projectlistingmanager.controller;

import gr.kalaentzis.projectlistingmanager.model.Listing;
import gr.kalaentzis.projectlistingmanager.model.User;
import gr.kalaentzis.projectlistingmanager.repository.ListingRepository;
import gr.kalaentzis.projectlistingmanager.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        System.out.println(listing);
        if (user.isPresent()){
            listingRepository.save(listing);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
}

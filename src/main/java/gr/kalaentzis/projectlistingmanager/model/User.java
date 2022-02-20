package gr.kalaentzis.projectlistingmanager.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * This class represents a user of the property listing management system
 */
@Entity
@Table(name = "Users")
public class User {
    @Id
    @GeneratedValue
    private Long id;

    private String username;
    private String password;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Listing> listings = new ArrayList<>();

    public User() {
    }

    public  User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // Basic Setters/Getters

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Listing> getListings() {
        return listings;
    }

    /**
     * Add's a listing to the user's list
     * @param listing the listing to be added
     * @return
     */
    public boolean addListing(Listing listing) {
        return listings.add(listing);
    }

    /**
     * Removes a listing from the user's list
     * @param id the listing id to be removed
     * @return
     */
    public boolean removeListing(Long id) {
        for (Listing listing : listings) {
            if(listing.getId().equals(id))
                return listings.remove(listing);
        }
        // Didn't remove anything
        return false;
    }


}

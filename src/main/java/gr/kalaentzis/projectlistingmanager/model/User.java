package gr.kalaentzis.projectlistingmanager.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

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

    public boolean addListing(Listing listing) {
        return listings.add(listing);
    }

    public boolean removeListing(Long id) {
        for (Listing listing : listings) {
            if(listing.getId().equals(id))
                return listings.remove(listing);
        }
        // Didn't remove anything
        return false;
    }


}

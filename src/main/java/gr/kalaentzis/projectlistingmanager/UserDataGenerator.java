package gr.kalaentzis.projectlistingmanager;

import gr.kalaentzis.projectlistingmanager.model.Listing;
import gr.kalaentzis.projectlistingmanager.model.User;
import gr.kalaentzis.projectlistingmanager.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class UserDataGenerator implements CommandLineRunner {
    private final UserRepository userRepository;

    public UserDataGenerator(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        User user = new User("spitogatos", "pass");
        user.addListing(new Listing( "Αθήνα", 140000, "Πώληση", 110, user));
        user.addListing(new Listing( "Ηράκλειο", 650, "Ενοικίαση", 90, user));
        userRepository.save(user);
        userRepository.save(new User("kalaentzis","123"));
    }

}

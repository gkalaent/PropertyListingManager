package gr.kalaentzis.projectlistingmanager.controller;

import gr.kalaentzis.projectlistingmanager.model.User;
import gr.kalaentzis.projectlistingmanager.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity authUser (@RequestBody User user)  {
        List<User> users = userRepository.findAll();
        for (User cUser : users) {
            if ((cUser.getUsername().equals(user.getUsername())) &&
                    (cUser.getPassword().equals(user.getPassword()))){
                return ResponseEntity.ok(cUser);
            }
        }
        return new ResponseEntity<> (
                "Username or password incorrect",
                HttpStatus.UNAUTHORIZED);
    }

}

package gr.kalaentzis.projectlistingmanager.repository;

import gr.kalaentzis.projectlistingmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}

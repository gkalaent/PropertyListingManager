package gr.kalaentzis.projectlistingmanager.repository;

import gr.kalaentzis.projectlistingmanager.model.Listing;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ListingRepository extends JpaRepository<Listing, Long> {
}

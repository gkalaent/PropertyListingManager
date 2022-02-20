package gr.kalaentzis.projectlistingmanager;

import gr.kalaentzis.projectlistingmanager.controller.AuthController;
import gr.kalaentzis.projectlistingmanager.controller.ListingController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
class ProjectListingManagerApplicationTests {

    @Autowired
    private AuthController authController;
    @Autowired
    private ListingController listingController;


    /**
     * Simple test that asserts that the backend's controllers have been initialized
     */
    @Test
    void contextLoads() {
        assertThat(authController).isNotNull();
        assertThat(listingController).isNotNull();
    }

}

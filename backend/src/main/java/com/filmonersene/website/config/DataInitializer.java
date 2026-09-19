package com.filmonersene.website.config;

import com.filmonersene.website.entities.Role;
import com.filmonersene.website.entities.Tag;
import com.filmonersene.website.entities.User;
import com.filmonersene.website.repositories.RoleRepository;
import com.filmonersene.website.repositories.TagRepository;
import com.filmonersene.website.repositories.UserRepository;
import com.filmonersene.website.utils.Constants;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {


        Role role = roleRepository.findById(Constants.DEFAULT_ROLE_ID)
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName("ROLE_USER");
                    return roleRepository.save(newRole);
                });

        // Default tag
        Tag tag = tagRepository.findById(Constants.DEFAULT_TAG_ID)
                .orElseGet(() -> {
                    Tag newTag = new Tag();
                    newTag.setName("Yeni Üye");
                    newTag.setMinPoints(0);
                    return tagRepository.save(newTag);
                });

        // Demo user
        if (userRepository.findByEmail("demo@moviva.com").isEmpty()) {

            User user = new User();

            user.setUsername("demo");
            user.setEmail("demo@moviva.com");
            user.setPassword(passwordEncoder.encode("Demo1234!"));
            user.setName("");
            user.setSurname("");
            user.setBio("Moviva demo hesabı");
            user.setPoints(0);
            user.setEnabled(true);
            user.setTag(tag);
            user.setRole(role);

            userRepository.save(user);
        }
    }
}
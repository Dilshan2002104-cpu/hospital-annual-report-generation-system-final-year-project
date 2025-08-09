package com.HMS.HMS.config;

import com.HMS.HMS.model.User.Role;
import com.HMS.HMS.model.User.User;
import com.HMS.HMS.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {


    private final UserRepository userRepo;

    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepo.existsById("ADMIN001")) {
            User admin = new User();
            admin.setEmpId("ADMIN001");
            admin.setUsername("defaultadmin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepo.save(admin);
            System.out.println("Default admin created: EMPID=ADMIN001, password=admin123");
        }
    }
}

package com.avaliaccess.aa_backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.avaliaccess.aa_backend.entity.Role;
import com.avaliaccess.aa_backend.entity.User;
import com.avaliaccess.aa_backend.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    @SuppressWarnings("unused")
    CommandLineRunner initUsers(UserRepository users, PasswordEncoder encoder) {
        return args -> {
            // Criar usuário administrador
            final String adminEmail = "admin@avaliaccess.com";
            if (!users.existsByEmail(adminEmail)) {
                User admin = new User();
                admin.setName("Administrador");
                admin.setEmail(adminEmail);
                admin.setPassword(encoder.encode("admin123"));
                admin.getRoles().add(Role.ADMINISTRADOR);
                admin.getRoles().add(Role.USUARIO);
                users.save(admin);
                System.out.println("Usuário ADMIN criado: " + adminEmail + " / admin123");
            }

            // Criar usuário comum
            final String userEmail = "usuario@avaliaccess.com";
            if (!users.existsByEmail(userEmail)) {
                User usuario = new User();
                usuario.setName("Usuário Comum");
                usuario.setEmail(userEmail);
                usuario.setPassword(encoder.encode("usuario123"));
                usuario.getRoles().add(Role.USUARIO);
                users.save(usuario);
                System.out.println("Usuário comum criado: " + userEmail + " / usuario123");
            }
        };
    }
}

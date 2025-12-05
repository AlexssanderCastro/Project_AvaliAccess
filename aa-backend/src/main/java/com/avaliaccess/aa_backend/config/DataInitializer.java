package com.avaliaccess.aa_backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.avaliaccess.aa_backend.entity.Establishment;
import com.avaliaccess.aa_backend.entity.Role;
import com.avaliaccess.aa_backend.entity.User;
import com.avaliaccess.aa_backend.repository.EstablishmentRepository;
import com.avaliaccess.aa_backend.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    @SuppressWarnings("unused")
    CommandLineRunner initData(UserRepository users, EstablishmentRepository establishments, PasswordEncoder encoder) {
        return args -> {
            // Criar usuário administrador
            final String adminEmail = "admin@avaliaccess.com";
            User admin;
            if (!users.existsByEmail(adminEmail)) {
                admin = new User();
                admin.setName("Administrador");
                admin.setEmail(adminEmail);
                admin.setPassword(encoder.encode("admin123"));
                admin.getRoles().add(Role.ADMINISTRADOR);
                admin.getRoles().add(Role.USUARIO);
                admin = users.save(admin);
                System.out.println("Usuário ADMIN criado: " + adminEmail + " / admin123");
            } else {
                admin = users.findByEmail(adminEmail).orElseThrow();
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

            // Criar estabelecimentos de teste
            if (establishments.count() == 0) {
                Establishment restaurante = new Establishment();
                restaurante.setName("Restaurante Sabor da Terra");
                restaurante.setAddress("Rua das Flores, 123");
                restaurante.setCity("São Paulo");
                restaurante.setState("SP");
                restaurante.setType("Restaurante");
                restaurante.setCreatedBy(admin);
                establishments.save(restaurante);

                Establishment hotel = new Establishment();
                hotel.setName("Hotel Conforto");
                hotel.setAddress("Avenida Central, 456");
                hotel.setCity("Rio de Janeiro");
                hotel.setState("RJ");
                hotel.setType("Hotel");
                hotel.setCreatedBy(admin);
                establishments.save(hotel);

                Establishment cafe = new Establishment();
                cafe.setName("Café Aroma");
                cafe.setAddress("Rua do Comércio, 789");
                cafe.setCity("Belo Horizonte");
                cafe.setState("MG");
                cafe.setType("Café");
                cafe.setCreatedBy(admin);
                establishments.save(cafe);

                Establishment shopping = new Establishment();
                shopping.setName("Shopping Praça Verde");
                shopping.setAddress("Avenida dos Estados, 1000");
                shopping.setCity("Curitiba");
                shopping.setState("PR");
                shopping.setType("Shopping");
                shopping.setCreatedBy(admin);
                establishments.save(shopping);

                Establishment cinema = new Establishment();
                cinema.setName("Cinemax");
                cinema.setAddress("Rua das Artes, 250");
                cinema.setCity("Porto Alegre");
                cinema.setState("RS");
                cinema.setType("Cinema");
                cinema.setCreatedBy(admin);
                establishments.save(cinema);

                Establishment academia = new Establishment();
                academia.setName("Academia Corpo Saudável");
                academia.setAddress("Rua da Saúde, 333");
                academia.setCity("Brasília");
                academia.setState("DF");
                academia.setType("Academia");
                academia.setCreatedBy(admin);
                establishments.save(academia);

                System.out.println("6 estabelecimentos de teste criados sem imagem");
            }
        };
    }
}

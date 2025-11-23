package com.avaliaccess.aa_backend.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.avaliaccess.aa_backend.dto.EstablishmentRequest;
import com.avaliaccess.aa_backend.dto.EstablishmentResponse;
import com.avaliaccess.aa_backend.entity.Establishment;
import com.avaliaccess.aa_backend.entity.User;
import com.avaliaccess.aa_backend.repository.EstablishmentRepository;
import com.avaliaccess.aa_backend.repository.UserRepository;

@Service
public class EstablishmentService {

    private final EstablishmentRepository establishmentRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public EstablishmentService(EstablishmentRepository establishmentRepository, 
                               UserRepository userRepository,
                               FileStorageService fileStorageService) {
        this.establishmentRepository = establishmentRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public EstablishmentResponse createEstablishment(EstablishmentRequest request, 
                                                     MultipartFile photo, 
                                                     String userEmail) throws IOException {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Establishment establishment = new Establishment();
        establishment.setName(request.name());
        establishment.setAddress(request.address());
        establishment.setCity(request.city());
        establishment.setState(request.state());
        establishment.setType(request.type());
        establishment.setCreatedBy(user);

        // Upload da foto se fornecida
        if (photo != null && !photo.isEmpty()) {
            String fileName = fileStorageService.storeFile(photo);
            establishment.setPhotoUrl("/api/establishments/photo/" + fileName);
        }

        Establishment saved = establishmentRepository.save(establishment);
        return mapToResponse(saved);
    }

    @Transactional
    public EstablishmentResponse updateEstablishment(Long id, 
                                                     EstablishmentRequest request,
                                                     MultipartFile photo,
                                                     String userEmail) throws IOException {
        Establishment establishment = establishmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Estabelecimento não encontrado"));

        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Verificar se o usuário é o criador ou é admin
        if (!establishment.getCreatedBy().getId().equals(user.getId()) && 
            !user.getRoles().contains(com.avaliaccess.aa_backend.entity.Role.ADMINISTRADOR)) {
            throw new RuntimeException("Você não tem permissão para editar este estabelecimento");
        }

        establishment.setName(request.name());
        establishment.setAddress(request.address());
        establishment.setCity(request.city());
        establishment.setState(request.state());
        establishment.setType(request.type());

        // Atualizar foto se fornecida
        if (photo != null && !photo.isEmpty()) {
            // Deletar foto antiga
            if (establishment.getPhotoUrl() != null) {
                String oldFileName = establishment.getPhotoUrl().substring(
                    establishment.getPhotoUrl().lastIndexOf("/") + 1);
                fileStorageService.deleteFile(oldFileName);
            }
            
            String fileName = fileStorageService.storeFile(photo);
            establishment.setPhotoUrl("/api/establishments/photo/" + fileName);
        }

        Establishment saved = establishmentRepository.save(establishment);
        return mapToResponse(saved);
    }

    public List<EstablishmentResponse> getAllEstablishments() {
        return establishmentRepository.findAll().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public EstablishmentResponse getEstablishmentById(Long id) {
        Establishment establishment = establishmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Estabelecimento não encontrado"));
        return mapToResponse(establishment);
    }

    public List<EstablishmentResponse> getEstablishmentsByCity(String city) {
        return establishmentRepository.findByCity(city).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public List<EstablishmentResponse> getEstablishmentsByType(String type) {
        return establishmentRepository.findByType(type).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public Page<EstablishmentResponse> searchEstablishments(
            String name, String city, String state, String type,
            int page, int size, String sortBy, String sortDirection) {
        
        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc") 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<Establishment> establishments = establishmentRepository.searchEstablishments(
            name, city, state, type, pageable);
        
        return establishments.map(this::mapToResponse);
    }

    @Transactional
    public void deleteEstablishment(Long id, String userEmail) throws IOException {
        Establishment establishment = establishmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Estabelecimento não encontrado"));

        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Verificar permissão
        if (!establishment.getCreatedBy().getId().equals(user.getId()) && 
            !user.getRoles().contains(com.avaliaccess.aa_backend.entity.Role.ADMINISTRADOR)) {
            throw new RuntimeException("Você não tem permissão para deletar este estabelecimento");
        }

        // Deletar foto
        if (establishment.getPhotoUrl() != null) {
            String fileName = establishment.getPhotoUrl().substring(
                establishment.getPhotoUrl().lastIndexOf("/") + 1);
            fileStorageService.deleteFile(fileName);
        }

        establishmentRepository.delete(establishment);
    }

    private EstablishmentResponse mapToResponse(Establishment establishment) {
        return new EstablishmentResponse(
            establishment.getId(),
            establishment.getName(),
            establishment.getAddress(),
            establishment.getCity(),
            establishment.getState(),
            establishment.getType(),
            establishment.getPhotoUrl(),
            establishment.getAverageRating(),
            establishment.getTotalRatings(),
            establishment.getCreatedBy().getName(),
            establishment.getCreatedBy().getId(),
            establishment.getCreatedAt(),
            establishment.getUpdatedAt()
        );
    }
}

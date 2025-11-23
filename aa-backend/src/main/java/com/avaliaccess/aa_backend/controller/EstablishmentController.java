package com.avaliaccess.aa_backend.controller;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.avaliaccess.aa_backend.dto.EstablishmentRequest;
import com.avaliaccess.aa_backend.dto.EstablishmentResponse;
import com.avaliaccess.aa_backend.service.EstablishmentService;
import com.avaliaccess.aa_backend.service.FileStorageService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/establishments")
public class EstablishmentController {

    private final EstablishmentService establishmentService;
    private final FileStorageService fileStorageService;

    public EstablishmentController(EstablishmentService establishmentService,
                                   FileStorageService fileStorageService) {
        this.establishmentService = establishmentService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createEstablishment(
            @Valid @RequestPart("establishment") EstablishmentRequest request,
            @RequestPart(value = "photo", required = false) MultipartFile photo,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            EstablishmentResponse response = establishmentService.createEstablishment(request, photo, userEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Erro ao fazer upload da foto", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Erro ao criar estabelecimento", e.getMessage()));
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateEstablishment(
            @PathVariable Long id,
            @Valid @RequestPart("establishment") EstablishmentRequest request,
            @RequestPart(value = "photo", required = false) MultipartFile photo,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            EstablishmentResponse response = establishmentService.updateEstablishment(id, request, photo, userEmail);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Erro ao fazer upload da foto", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Erro ao atualizar estabelecimento", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<EstablishmentResponse>> getAllEstablishments() {
        return ResponseEntity.ok(establishmentService.getAllEstablishments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEstablishmentById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(establishmentService.getEstablishmentById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("Estabelecimento não encontrado", e.getMessage()));
        }
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<EstablishmentResponse>> getEstablishmentsByCity(@PathVariable String city) {
        return ResponseEntity.ok(establishmentService.getEstablishmentsByCity(city));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<EstablishmentResponse>> getEstablishmentsByType(@PathVariable String type) {
        return ResponseEntity.ok(establishmentService.getEstablishmentsByType(type));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<EstablishmentResponse>> searchEstablishments(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        
        Page<EstablishmentResponse> results = establishmentService.searchEstablishments(
            name, city, state, type, page, size, sortBy, sortDirection);
        return ResponseEntity.ok(results);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEstablishment(@PathVariable Long id, Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            establishmentService.deleteEstablishment(id, userEmail);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse("Erro ao deletar estabelecimento", e.getMessage()));
        }
    }

    @GetMapping("/photo/{fileName:.+}")
    public ResponseEntity<Resource> getPhoto(@PathVariable String fileName) {
        try {
            Path filePath = fileStorageService.getFilePath(fileName);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                String contentType = "image/jpeg"; // Default
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private record ErrorResponse(String message, String details) {}
}

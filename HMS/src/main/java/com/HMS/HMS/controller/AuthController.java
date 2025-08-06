package com.HMS.HMS.controller;

import com.HMS.HMS.DTO.AuthRequest;
import com.HMS.HMS.DTO.AuthResponse;
import com.HMS.HMS.DTO.RegisterResponseDTO;
import com.HMS.HMS.model.User;
import com.HMS.HMS.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request){
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@RequestBody User user){
        authService.register(user);
        RegisterResponseDTO response = new RegisterResponseDTO(true,"User registered successfully");
        return ResponseEntity.ok(response);
    }
}

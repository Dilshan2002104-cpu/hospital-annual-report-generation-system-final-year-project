package com.HMS.HMS.service;

import com.HMS.HMS.DTO.AuthRequest;
import com.HMS.HMS.DTO.AuthResponse;
import com.HMS.HMS.Exception_Handler.EmployeeIdAlreadyExistsException;
import com.HMS.HMS.Exception_Handler.InvalidPasswordException;
import com.HMS.HMS.Exception_Handler.UserNotFoundException;
import com.HMS.HMS.model.User;
import com.HMS.HMS.repository.UserRepository;
import com.HMS.HMS.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse login(AuthRequest request){
        User user = userRepository.findByEmpId(request.getEmpId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if(!passwordEncoder.matches(request.getPassword(),user.getPassword())){
            throw new InvalidPasswordException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmpId(),user.getRole().name());
        return new AuthResponse(true,"Login successful",token);
    }

    public void register(User user){
        if(userRepository.existsById(user.getEmpId())){
            throw new EmployeeIdAlreadyExistsException("Employee ID already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }
}

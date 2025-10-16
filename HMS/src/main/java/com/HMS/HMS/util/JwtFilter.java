package com.HMS.HMS.util;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if(header != null && header.startsWith("Bearer ")){
            try {
                String token = header.substring(7);
                Claims claims = jwtUtil.extractClaims(token);
                String empId = claims.getSubject();
                String role = (String) claims.get("role");

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(empId,null, List.of(new SimpleGrantedAuthority("ROLE_"+role)));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } catch (Exception e) {
                // Log the error and continue without authentication
                // This allows requests to endpoints configured with permitAll() to proceed
                logger.warn("JWT validation failed: " + e.getMessage());
            }
        }
        chain.doFilter(request,response);
    }
}

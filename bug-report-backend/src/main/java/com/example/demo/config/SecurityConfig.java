package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/webUser/register","/users/**","/bug/**", "/comment/**", "/tag/**", "/api/**", "/resetPass/**", "/auth/login") // ✅ Disable CSRF for these APIs
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/**").permitAll() // ✅ Allow public access
                        .anyRequest().authenticated() // ✅ Require authentication for everything else
                )
                .formLogin(login -> login.disable()) // ✅ Disable default login page
                .logout(logout -> logout.logoutUrl("/logout").logoutSuccessUrl("/index.html")); // ✅ Logout redirects to index.html

        return http.build();
    }
}


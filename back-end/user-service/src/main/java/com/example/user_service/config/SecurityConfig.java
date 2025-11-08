package com.example.user_service.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
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
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. (새 문법) CSRF 보호 비활성화
            .csrf(csrf -> csrf.disable()) 
            // 2. (새 문법) 기본 폼 로그인 비활성화
            .formLogin(formLogin -> formLogin.disable()) 
            // 3. (새 문법) HTTP Basic 인증 비활성화
            .httpBasic(httpBasic -> httpBasic.disable()) 

            // 4. 세션 관리를 Stateless로 설정 (동일)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // 5. (새 문법) URL별 접근 권한 설정
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/login").permitAll() 
                .requestMatchers("/users/signup").permitAll()
                .anyRequest().authenticated() // 나머지 모든 요청은 인증 필요
            );
            
        return http.build();
    }
}
package com.example.user_service.security;

import com.example.user_service.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class WebSecurity {

    private final UserService userService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final Environment env;

    public WebSecurity(Environment env, UserService userService, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.env = env;
        this.userService = userService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Bean
    protected SecurityFilterChain configure(HttpSecurity http) throws Exception {
        // 1. AuthenticationManager 생성 (로그인 처리를 위해 필수)
        AuthenticationManagerBuilder authenticationManagerBuilder = 
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(userService).passwordEncoder(bCryptPasswordEncoder);
        AuthenticationManager authenticationManager = authenticationManagerBuilder.build();

        http
            // [중요] CSRF 비활성화 (REST API에서는 보통 끔)
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth
                // [중요] /users(가입), /login(로그인), /h2-console 등은 인증 없이 허용
                .requestMatchers(new AntPathRequestMatcher("/users/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/login")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/h2-console/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/actuator/**")).permitAll() // 상태 확인용
                .anyRequest().authenticated()
            )

            // AuthenticationManager 등록
            .authenticationManager(authenticationManager)
            
            // h2-console 사용 시 프레임 옵션 해제
            .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        // 커스텀 필터(AuthenticationFilter)가 있다면 여기서 addFilter로 추가해야 함
        // http.addFilter(getAuthenticationFilter(authenticationManager));

        return http.build();
    }
}
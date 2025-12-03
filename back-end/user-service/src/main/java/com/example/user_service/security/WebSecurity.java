package com.example.user_service.security;

import com.example.user_service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurity {

    private final UserService userService;
    private final Environment env;

    public WebSecurity(Environment env, UserService userService) {
        this.env = env;
        this.userService = userService;
    }

    @Bean
    public static BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    protected SecurityFilterChain configure(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(userService).passwordEncoder(passwordEncoder());
        AuthenticationManager authenticationManager = authenticationManagerBuilder.build();

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/error").permitAll()
                .requestMatchers("/users/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/actuator/**").permitAll()
                .anyRequest().authenticated() // 나머지는 인증 필요
            )
            .authenticationManager(authenticationManager)
            // ▼▼▼ [필터 추가] 만든 필터를 여기에 등록! ▼▼▼
            .addFilter(getAuthenticationFilter(authenticationManager))
            
            .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }

    // 필터 인스턴스를 생성해주는 도우미 메서드
    private AuthenticationFilter getAuthenticationFilter(AuthenticationManager authenticationManager) {
        AuthenticationFilter authenticationFilter = 
            new AuthenticationFilter(authenticationManager, userService, env);
        // /login 대신 다른 주소로 로그인하고 싶다면 여기서 변경 가능 (기본값은 /login)
        return authenticationFilter;
    }
}
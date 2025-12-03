package com.example.user_service.security;

import com.example.user_service.UserService;
import com.example.user_service.dto.RequestLogin;
import com.example.user_service.dto.UserDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.ArrayList;
import java.util.Date;

public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final UserService userService;
    private final Environment env;

    public AuthenticationFilter(AuthenticationManager authenticationManager, 
                                UserService userService, 
                                Environment env) {
        super.setAuthenticationManager(authenticationManager);
        this.userService = userService;
        this.env = env;

        setFilterProcessesUrl("/users/login"); // 로그인 URL 설정
    }

    // 1. 로그인 시도: /login 요청이 오면 여기서 가로챕니다.
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
                                                HttpServletResponse response) throws AuthenticationException {
        try {
            // JSON 데이터를 RequestLogin 클래스로 변환
            RequestLogin creds = new ObjectMapper().readValue(request.getInputStream(), RequestLogin.class);

            // 아이디, 비번이 맞는지 매니저에게 검증 요청
            return getAuthenticationManager().authenticate(
                    new UsernamePasswordAuthenticationToken(
                            creds.getEmail(),
                            creds.getPassword(),
                            new ArrayList<>()
                    )
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    // 2. 로그인 성공 시: 토큰(JWT)을 만들어서 헤더에 넣어줍니다.
    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {
        // 인증된 사용자 정보 가져오기
        String userName = ((User) authResult.getPrincipal()).getUsername();
        UserDto userDetails = userService.getUserDetailsByEmail(userName);

        // 토큰 생성용 키 만들기 (yml 파일의 secret 값 사용)
        String secret = env.getProperty("token.secret");
        Key secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        // JWT 토큰 생성
        String token = Jwts.builder()
                .setSubject(userDetails.getUserId()) // 토큰 주제는 userId(UUID)
                .setExpiration(new Date(System.currentTimeMillis() + 
                        Long.parseLong(env.getProperty("token.expiration_time"))))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();

        // 헤더에 토큰과 userId를 담아서 응답
        response.addHeader("token", token);
        response.addHeader("userId", userDetails.getUserId());
    }
}
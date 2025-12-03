package com.example.user_service.controller;

import com.example.user_service.UserService;
import com.example.user_service.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users") // [중요] 모든 주소 앞에 /users 자동 붙음
@RequiredArgsConstructor
public class UserController {

    private final Environment env;
    private final UserService userService;

    // 1. 상태 체크 (GET /users/health_check)
    @GetMapping("/health_check")
    public String status() {
        return "It's Working in User Service on PORT " 
                + env.getProperty("local.server.port");
    }

    // 2. 회원가입 (POST /users)
    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
        UserDto createdUser = userService.createUser(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    // 3. 사용자 목록 조회 (GET /users)
    @GetMapping
    public ResponseEntity<List<UserDto>> showUsers() {
        // Repository 직접 접근 금지 -> Service를 통해 DTO 리스트 받기
        List<UserDto> userList = userService.getUserByAll();
        return ResponseEntity.status(HttpStatus.OK).body(userList);
    }

    // 4. 로그아웃 (POST /users/logout)
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // 토큰 방식은 서버에 세션이 없으므로 클라이언트에게 "성공" 응답만 주면 됨
        return ResponseEntity.ok("로그아웃 성공 (클라이언트 토큰 삭제 필요)");
    }
}
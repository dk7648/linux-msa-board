package com.example.user_service.controller;

import com.example.user_service.UserService;
import com.example.user_service.dto.UserDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserRestController {

    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 회원가입 API
     * POST /users/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto userDto) {
        try {
            // 프론트엔드에서 username, fullName으로 보내면 name에 매핑
            if (userDto.getName() == null && userDto.getFullName() != null) {
                userDto.setName(userDto.getFullName());
            }
            if (userDto.getName() == null && userDto.getUsername() != null) {
                userDto.setName(userDto.getUsername());
            }
            
            UserDto createdUser = userService.createUser(userDto);
            
            // 프론트엔드 응답 형식에 맞춤
            Map<String, Object> response = new HashMap<>();
            
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", 1); // 임시 ID
            userMap.put("email", createdUser.getEmail());
            userMap.put("username", createdUser.getName());
            userMap.put("fullName", createdUser.getName());
            userMap.put("createdAt", java.time.LocalDateTime.now().toString());
            userMap.put("updatedAt", java.time.LocalDateTime.now().toString());
            
            response.put("user", userMap);
            response.put("token", "temp-token-" + System.currentTimeMillis()); // 임시 토큰
            response.put("refreshToken", "temp-refresh-" + System.currentTimeMillis());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "회원가입에 실패했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * 현재 사용자 정보 조회 API
     * GET /users/me
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            // TODO: JWT 토큰에서 이메일 추출 후 사용자 조회
            Map<String, String> error = new HashMap<>();
            error.put("message", "인증이 필요합니다");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "사용자 정보 조회 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Health Check
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("User Service is running");
    }
}

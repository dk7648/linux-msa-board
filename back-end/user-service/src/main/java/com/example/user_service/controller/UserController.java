// 1. 패키지 경로를 "controller"로 변경 (권장)
package com.example.user_service.controller; 

import com.example.user_service.dto.UserDto;
import com.example.user_service.jpa.UserEntity; // 2. <User>가 아닌 UserEntity를 임포트
import com.example.user_service.jpa.UserRepository;
import com.example.user_service.UserService; // 3. UserService 임포트
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users") // 4. 공통 경로를 /users로 지정
@RequiredArgsConstructor
public class UserController {

    // 5. 로직은 Service를 통해 처리하도록 변경
    private final UserService userService;
    // (findAll()을 위해 임시로 Repository도 주입)
    private final UserRepository userRepository; 

    // --- (이전에 만든) 회원가입 (POST /users) ---
    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
        UserDto createdUser = userService.createUser(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    // --- (오류 수정) 회원 전체 조회 (GET /users) ---
    @GetMapping
    public ResponseEntity<List<UserEntity>> showUsers() {
        // 6. userRepository.findAll()은 List<UserEntity>를 반환합니다.
        List<UserEntity> users = userRepository.findAll();
        
        // 7. (주의!) 이 방식은 암호화된 비밀번호(encryptedPassword)까지
        //    모두 노출되므로, 실제 서비스에서는 DTO로 변환해서 반환해야 합니다.
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }
}
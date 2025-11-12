package com.example.user_service.controller; 

import com.example.user_service.dto.UserDto;
import com.example.user_service.jpa.UserEntity; 
import com.example.user_service.jpa.UserRepository;
import com.example.user_service.UserService; 
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users") // 공통 경로를 /users로 지정
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository; 

    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
        UserDto createdUser = userService.createUser(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @GetMapping
    public ResponseEntity<List<UserEntity>> showUsers() {
        List<UserEntity> users = userRepository.findAll();
        
        // (주의!) 이 방식은 암호화된 비밀번호(encryptedPassword)까지
        //    모두 노출되므로, 실제 서비스에서는 DTO로 변환해서 반환해야 합니다.
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }
}
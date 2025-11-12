package com.example.user_service.dto;

import lombok.Data;

@Data
public class UserDto {
    private String email;
    private String name;
    private String password;
    
    // (응답으로 사용할 정보)
    private String userId; 
    private String encryptedPassword; // (DB 저장용)
}

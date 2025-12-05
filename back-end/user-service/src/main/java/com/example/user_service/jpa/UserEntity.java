package com.example.user_service.jpa;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users") // 예약어 'User' 피하기 위해 'users' 사용
public class UserEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // DB 자동 생성 ID

    @Column(nullable = false, length = 50, unique = true)
    private String email;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, unique = true)
    private String userId; // UUID 저장용

    @Column(nullable = false, unique = true)
    private String encryptedPassword; // 암호화된 비번 저장용
}

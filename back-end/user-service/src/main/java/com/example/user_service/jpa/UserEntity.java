package com.example.user_service.jpa;

import jakarta.persistence.*; 
import lombok.Data;

@Data 
@Entity
@Table(name = "users")
public class UserEntity {

    @Id // 기본 키(PK)임을 선언
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id; // DB 내부에서 쓰는 숫자 ID

    @Column(nullable = false, length = 50, unique = true) // null 불가, 길이 50, 유니크
    private String email;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, unique = true) 
    private String userId; // 외부에 노출되는 유니크 ID (UUID)

    @Column(nullable = false)
    private String encryptedPassword; // 암호화된 비밀번호 저장
}